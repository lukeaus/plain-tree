#!/usr/bin/env bash
# Local probes for scripts/release/check-npm-auth.sh (VAL-REL-007 evidence).
#
# Positive: a clean npm config passes.
# Negative (disposable temp fixtures): every auth-bearing key/value is rejected
#   and the fixture value is never printed. Covers _authToken, _auth,
#   _password/password, token, username, otp, certfile, keyfile, scoped
#   registry keys, and case/spacing variants. A disposable npm_config_*
#   environment probe is included.
#
# Run: bash scripts/release/check-npm-auth-probes.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECK="$SCRIPT_DIR/check-npm-auth.sh"
WORK="$(mktemp -d)"
# Clean cwd with no .npmrc so default-mode resolver probes inspect only the
# stubbed npm resolver, never a host repository config.
mkdir -p "$WORK/clean-cwd"
trap 'rm -rf "$WORK"' EXIT

# Non-sensitive fixture value used only to assert it never appears in output.
MARKER='probe-leak-fixture-9f3c2a'
pass=0
fail=0

# run_check <file> [extra env NAME=VAL ...]
# Captures combined output into RUN_OUT and the exit code into RUN_RC.
# env -i isolates the probes from the host shell so the positive probe is
# deterministic and the env probe tests only the intended variable.
run_check() {
  file="$1"; shift
  RUN_OUT="$(mktemp)"
  set +e
  env -i PATH="$PATH" "$@" bash "$CHECK" "$file" >"$RUN_OUT" 2>&1
  RUN_RC=$?
  set -e
}

assert_passes() {
  label="$1"; file="$2"; shift 2
  run_check "$file" "$@"
  if [ "$RUN_RC" -eq 0 ] && ! grep -qF "$MARKER" "$RUN_OUT"; then
    echo "PASS (positive): $label"; pass=$((pass + 1))
  else
    leaked=no; grep -qF "$MARKER" "$RUN_OUT" && leaked=yes
    echo "FAIL (positive): $label (rc=$RUN_RC, leaked=$leaked)"; fail=$((fail + 1))
    cat "$RUN_OUT"
  fi
}

assert_rejected() {
  label="$1"; file="$2"; shift 2
  run_check "$file" "$@"
  if [ "$RUN_RC" -ne 0 ] && ! grep -qF "$MARKER" "$RUN_OUT"; then
    echo "PASS (negative): $label"; pass=$((pass + 1))
  else
    leaked=no; grep -qF "$MARKER" "$RUN_OUT" && leaked=yes
    echo "FAIL (negative): $label (rc=$RUN_RC, leaked=$leaked)"; fail=$((fail + 1))
    cat "$RUN_OUT"
  fi
}

# run_check_default <stub-dir> [extra env NAME=VAL ...]
# Runs the check in default mode (no file args; resolves userconfig/globalconfig
# via the stubbed npm on PATH) from the clean temp cwd. Captures combined
# output into RUN_OUT and the exit code into RUN_RC.
run_check_default() {
  stubdir="$1"; shift
  RUN_OUT="$(mktemp)"
  set +e
  ( cd "$WORK/clean-cwd" && env -i PATH="$stubdir:$PATH" "$@" bash "$CHECK" >"$RUN_OUT" 2>&1 )
  RUN_RC=$?
  set -e
}

# assert_resolver_fails <label> <stub-body>
# A stubbed npm that makes `npm config get userconfig`/`globalconfig` fail must
# fail the auth guard closed: nonzero exit, no misleading user/global
# "absent (OK)" success, no final success line, and no value leak.
assert_resolver_fails() {
  label="$1"; stub_body="$2"
  stubdir="$(mktemp -d)"
  printf '%s\n' "$stub_body" >"$stubdir/npm"
  chmod +x "$stubdir/npm"
  run_check_default "$stubdir"
  rm -rf "$stubdir"
  if [ "$RUN_RC" -ne 0 ] \
     && ! grep -qF 'user npm config absent (OK)' "$RUN_OUT" \
     && ! grep -qF 'global npm config absent (OK)' "$RUN_OUT" \
     && ! grep -qF 'no nonempty npm auth-bearing config found (OK)' "$RUN_OUT" \
     && ! grep -qF "$MARKER" "$RUN_OUT"; then
    echo "PASS (resolver-fail): $label"; pass=$((pass + 1))
  else
    leaked=no; grep -qF "$MARKER" "$RUN_OUT" && leaked=yes
    echo "FAIL (resolver-fail): $label (rc=$RUN_RC, leaked=$leaked)"; fail=$((fail + 1))
    cat "$RUN_OUT"
  fi
}

# Positive: clean config has no auth-bearing key.
cat >"$WORK/clean.npmrc" <<'EOF'
registry=https://registry.npmjs.org/
fund=false
audit=false
EOF
assert_passes 'clean config passes' "$WORK/clean.npmrc"

# Negative file fixtures: one auth-bearing key each. The shared value is the
# fixture marker; the check must reject each and never echo it.
write_fixture() { printf '%s\n' "$1" >"$WORK/fixture.npmrc"; }

write_fixture "_authToken=$MARKER";                      assert_rejected '_authToken' "$WORK/fixture.npmrc"
write_fixture "_auth=$MARKER";                          assert_rejected '_auth' "$WORK/fixture.npmrc"
write_fixture "_password=$MARKER";                      assert_rejected '_password' "$WORK/fixture.npmrc"
write_fixture "password=$MARKER";                       assert_rejected 'password' "$WORK/fixture.npmrc"
write_fixture "token=$MARKER";                          assert_rejected 'token' "$WORK/fixture.npmrc"
write_fixture "username=$MARKER";                       assert_rejected 'username' "$WORK/fixture.npmrc"
write_fixture "otp=$MARKER";                            assert_rejected 'otp' "$WORK/fixture.npmrc"
write_fixture "certfile=$MARKER";                        assert_rejected 'certfile' "$WORK/fixture.npmrc"
write_fixture "keyfile=$MARKER";                         assert_rejected 'keyfile' "$WORK/fixture.npmrc"
write_fixture "@myscope:_authToken=$MARKER";            assert_rejected 'scoped @myscope:_authToken' "$WORK/fixture.npmrc"
write_fixture "//registry.example.com/:_authToken=$MARKER"; assert_rejected 'scoped URL _authToken' "$WORK/fixture.npmrc"
write_fixture "_AuthToken=$MARKER";                     assert_rejected 'case variant _AuthToken' "$WORK/fixture.npmrc"
printf '  _authToken  =  %s  \n' "$MARKER" >"$WORK/fixture.npmrc"; assert_rejected 'spacing variant' "$WORK/fixture.npmrc"

# Negative env probe: a disposable npm_config_* auth var must be rejected too.
assert_rejected 'env npm_config__authtoken' "$WORK/clean.npmrc" "npm_config__authtoken=$MARKER"

# Negative resolver probes (Bash 3.2 compatible): a stubbed npm that makes
# `npm config get userconfig`/`globalconfig` fail must fail the auth guard
# closed — nonzero exit, no misleading "absent (OK)" success, no value leak.
# Covers both nonzero-exit and empty-output resolver failures; a resolver
# failure must never mask as an absent-config success.
assert_resolver_fails 'npm config get exits nonzero' '#!/bin/sh
exit 1'

assert_resolver_fails 'npm config get returns empty' '#!/bin/sh
exit 0'

echo "---"
echo "probes: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
