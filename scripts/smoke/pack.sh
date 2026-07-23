#!/usr/bin/env bash
# Single package gate: clean build, pack, tarball allowlist, isolated temp
# consumer, CJS/ESM/UMD/strict-TS/ES5/runtime-dep checks. Default mode cleans
# up the temp consumer + tarball; PACK_DIR retains the tarball but still runs
# every consumer check (no early stop).
# ponytail: one shell, set -euo pipefail, direct binary paths over npx.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SMOKE_DIR="$REPO_DIR/scripts/smoke"

ALLOWLIST_FILE="$(mktemp)"
ACTUAL_FILE="$(mktemp)"
DRYRUN_FILE="$(mktemp)"
CONSUMER_DIR=""
TARBALL=""
ESM_CONVERTED_PATH="${ESM_CONVERTED_PATH:-/tmp/esm-converted.cjs}"
export ESM_CONVERTED_PATH

RETAIN_TARBALL=false
if [ -n "${PACK_DIR:-}" ]; then
  RETAIN_TARBALL=true
fi

cleanup() {
  [ -n "$CONSUMER_DIR" ] && rm -rf "$CONSUMER_DIR"
  rm -f "$ESM_CONVERTED_PATH" "$ALLOWLIST_FILE" "$ACTUAL_FILE" "$DRYRUN_FILE" /tmp/deps.json
  if [ -n "$TARBALL" ] && [ "$RETAIN_TARBALL" = "false" ]; then
    rm -f "$TARBALL"
  fi
}
trap cleanup EXIT

# Exact approved package surface. Order-independent; both sides are normalized
# with LC_ALL=C sort below so the comparison is deterministic across machines.
# No source, tests, config, workflow, lockfile, cache, source map, or
# contract-work file.
cat > "$ALLOWLIST_FILE" <<'EOF'
package/LICENSE
package/build/Node.d.ts
package/build/Tree.d.ts
package/build/create.d.ts
package/build/index.d.ts
package/build/index.js
package/build/index.mjs
package/build/index.umd.js
package/build/types.d.ts
package/build/utils.d.ts
package/build/utilsNodeTree.d.ts
package/package.json
package/readme.md
EOF
LC_ALL=C sort "$ALLOWLIST_FILE" -o "$ALLOWLIST_FILE"

# 1. Clean build (VAL-PKG-001, 003, 004, VAL-TOOL-020)
rm -rf build
npm run build

# 2. Dry-run listing (VAL-PKG-021)
npm pack --dry-run --json > "$DRYRUN_FILE"

# 3. Pack tarball. Compute the name from package.json rather than parsing
# `npm pack` stdout (which also carries the `prepare` lifecycle banner).
tarball_name="$(node -e "const p=require('./package.json'); console.log(p.name.replace(/^@/,'').replace(/\//g,'-')+'-'+p.version+'.tgz')")"
if [ "$RETAIN_TARBALL" = "true" ]; then
  mkdir -p "$PACK_DIR"
  npm pack --pack-destination="$PACK_DIR" >/dev/null
  TARBALL="$(cd "$PACK_DIR" && pwd)/$tarball_name"
else
  npm pack >/dev/null
  TARBALL="$(pwd)/$tarball_name"
fi
echo "Packed tarball: $TARBALL"

# 4. Verify actual tarball listing equals allowlist exactly (VAL-PKG-005, 021)
tar -tzf "$TARBALL" | LC_ALL=C sort > "$ACTUAL_FILE"
if ! diff -u "$ALLOWLIST_FILE" "$ACTUAL_FILE"; then
  echo 'ERROR: tarball contents do not match allowlist' >&2
  exit 1
fi
echo 'Tarball allowlist match OK'

# VAL-PKG-021: dry-run and actual pack contents agree (both match the allowlist)
node -e '
const fs = require("fs");
const assert = require("assert");
const dry = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
const allow = fs.readFileSync(process.argv[2], "utf8").trim().split("\n").sort();
const dryPaths = dry[0].files
  .map((f) => "package/" + f.path.replace(/^\/?package\//, ""))
  .sort();
assert.deepStrictEqual(dryPaths, allow, "dry-run paths:\n" + dryPaths.join("\n"));
console.log("Dry-run/actual agreement OK");
' "$DRYRUN_FILE" "$ALLOWLIST_FILE"

# 5. PACK_DIR retain mode: print listing + 10 SHA-256 hashes (no early stop)
if [ "$RETAIN_TARBALL" = "true" ]; then
  echo "=== Tarball listing (sorted) ==="
  tar -tzf "$TARBALL" | LC_ALL=C sort
  echo "=== SHA-256 hashes (3 JS bundles + 7 declarations) ==="
  for f in \
    build/index.js \
    build/index.mjs \
    build/index.umd.js \
    build/index.d.ts \
    build/Node.d.ts \
    build/Tree.d.ts \
    build/create.d.ts \
    build/types.d.ts \
    build/utils.d.ts \
    build/utilsNodeTree.d.ts; do
    hash="$(tar -xzOf "$TARBALL" "package/$f" | shasum -a 256 | cut -d" " -f1)"
    echo "$hash  package/$f"
  done
fi

# 6. Extract and verify packed package.json (VAL-PKG-006, 002)
node -e '
const assert = require("assert");
const { execSync } = require("child_process");
const json = execSync("tar -xzOf " + JSON.stringify(process.argv[1]) + " package/package.json").toString();
const pkg = JSON.parse(json);
assert.strictEqual(pkg.name, "@lukeaus/plain-tree");
assert.strictEqual(pkg.publishConfig.access, "public");
assert.strictEqual(pkg.main, "build/index.js");
assert.strictEqual(pkg.module, "build/index.mjs");
assert.strictEqual(pkg.unpkg, "build/index.umd.js");
assert.strictEqual(pkg.types, "build/index.d.ts");
assert.ok(!("source" in pkg), "source field must be absent");
assert.ok(!("exports" in pkg), "exports map must be absent");
assert.ok(!("engines" in pkg), "engines field must be absent");
assert.ok(
  !pkg.dependencies || Object.keys(pkg.dependencies).length === 0,
  "runtime dependencies must be empty, got: " + JSON.stringify(pkg.dependencies)
);
console.log("Packed manifest OK");
' "$TARBALL"

# 6b. Packed declaration contract: objectToNode and filterObject first
# parameter must be exactly `object` (ObjectKeyword), parsed via the
# installed TypeScript compiler API (VAL-PKG-016, VAL-PKG-017 round 2).
node "$SMOKE_DIR/decl-param-check.cjs" "$TARBALL"

# 7. Temp consumer: copy smoke files, init
CONSUMER_DIR="$(mktemp -d)"
cp "$SMOKE_DIR/consumers.cjs" "$SMOKE_DIR/consumers.mjs" \
   "$SMOKE_DIR/consumers-umd.cjs" "$SMOKE_DIR/consumers-ts.ts" \
   "$SMOKE_DIR/es5-check.cjs" "$CONSUMER_DIR/"
echo '{"name":"smoke-consumer","version":"0.0.0","private":true}' > "$CONSUMER_DIR/package.json"

# 8. Isolated plain install, no override flags (VAL-PKG-018)
(cd "$CONSUMER_DIR" && NPM_CONFIG_USERCONFIG=/dev/null npm install "$TARBALL")

# 9. Runtime dependency tree empty (VAL-PKG-019)
NPM_CONFIG_USERCONFIG=/dev/null npm ls --omit=dev --all --json --prefix "$CONSUMER_DIR" > /tmp/deps.json
node -e '
const fs = require("fs");
const assert = require("assert");
const tree = JSON.parse(fs.readFileSync("/tmp/deps.json", "utf8"));
const pkg = tree.dependencies && tree.dependencies["@lukeaus/plain-tree"];
assert.ok(pkg, "@lukeaus/plain-tree not found in installed tree");
const runtimeDeps = pkg.dependencies || {};
const depNames = Object.keys(runtimeDeps);
assert.deepStrictEqual(
  depNames,
  [],
  "runtime dependencies must be empty, got: " + JSON.stringify(depNames)
);
console.log("Runtime dependency tree OK (zero deps)");
'

# 10. ESM -> CJS conversion for the ES5 gate (exported path so es5-check reads it)
"$REPO_DIR/node_modules/.bin/rollup" \
  "$CONSUMER_DIR/node_modules/@lukeaus/plain-tree/build/index.mjs" \
  --format cjs --generatedCode es5 --file "$ESM_CONVERTED_PATH"

# 11. CJS consumer (VAL-PKG-007, 010, 014)
node "$CONSUMER_DIR/consumers.cjs"

# 12. ESM consumer (VAL-PKG-008, 010)
node "$CONSUMER_DIR/consumers.mjs"

# 13. UMD consumer in a fresh VM (VAL-PKG-009, 010)
CONSUMER_DIR="$CONSUMER_DIR" node "$CONSUMER_DIR/consumers-umd.cjs"

# 14. Strict TypeScript consumer (VAL-PKG-016, 017)
cat > "$CONSUMER_DIR/tsconfig.json" <<'EOF'
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": false,
    "noEmit": true,
    "moduleResolution": "node",
    "ignoreDeprecations": "6.0",
    "esModuleInterop": true,
    "target": "es2017",
    "lib": ["es2017", "dom"],
    "types": []
  },
  "include": ["consumers-ts.ts"]
}
EOF
"$REPO_DIR/node_modules/.bin/tsc" --project "$CONSUMER_DIR/tsconfig.json"

# 15. ES5 syntax gate (VAL-PKG-015). Run the repo copy so `require('eslint')`
# resolves from the repo's devDependencies; artifact paths are absolute via
# CONSUMER_DIR / ESM_CONVERTED_PATH.
CONSUMER_DIR="$CONSUMER_DIR" node "$SMOKE_DIR/es5-check.cjs"

# 16. Cleanup handled by trap; tarball retained only in PACK_DIR mode
if [ "$RETAIN_TARBALL" = "true" ]; then
  echo "Retained tarball: $TARBALL"
fi

echo "SMOKE OK"
