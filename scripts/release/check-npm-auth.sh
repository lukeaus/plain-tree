#!/usr/bin/env bash
# Pre-publication npm auth-config evidence (VAL-REL-007).
#
# Resolves and inspects repository, user, and global npm configuration plus
# npm_config_* environment keys. Fails closed (nonzero exit) on any nonempty
# auth-bearing value. Never prints secret values — only scope, file path,
# line number, and key name.
#
# Covers scoped registry keys and case/spacing variants of _authToken, _auth,
# _password/password, token, username, otp, certfile, and keyfile.
#
# Usage:
#   check-npm-auth.sh            # resolve repo .npmrc + user + global config
#   check-npm-auth.sh <file>...  # inspect the given file(s) instead (probes)
#
# ponytail: one guard in the shared place; the release workflow and the local
# probes both invoke this script so the logic is tested once.
set -euo pipefail

# Inspect a single npm config file. Args: scope, file.
# Skip absent/comment/blank lines. Parse key=value, trim whitespace, lowercase
# the key, strip any scope prefix (everything up to and including ':') so
# scoped keys like @scope:_authToken or //host/path/:_authToken collapse to
# _authtoken. Reject nonempty auth-bearing keys; emit only the key name.
check_file() {
  scope="$1"
  file="$2"
  if [ -z "$file" ] || [ "$file" = "undefined" ] || [ "$file" = "null" ] || [ ! -e "$file" ]; then
    echo "$scope npm config absent (OK)"
    return 0
  fi
  echo "$scope npm config path: $file"
  awk -v scope="$scope" '
    /^[[:space:]]*($|#|;)/ { next }
    {
      eq = index($0, "=")
      if (!eq) next
      key = substr($0, 1, eq - 1)
      val = substr($0, eq + 1)
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", key)
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", val)
      low = tolower(key)
      sub(/^.*:/, "", low)
      if (low ~ /^(_authtoken|_auth|_password|password|token|username|otp|certfile|keyfile)$/ && val != "") {
        printf "ERROR: nonempty npm auth-bearing key in %s config at line %d: %s\n", scope, NR, low > "/dev/stderr"
        bad = 1
      }
    }
    END { exit (bad ? 1 : 0) }
  ' "$file"
}

# Scan exported npm_config_* environment keys for auth-bearing names with
# nonempty values. Emit only the variable name, never its value.
check_env() {
  bad=0
  while IFS= read -r name; do
    val="${!name:-}"
    [ -n "$val" ] || continue
    lower=$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]')
    case "$lower" in
      npm_config_*authtoken*|npm_config_*_auth*|npm_config_*password*|npm_config_*token*|npm_config_*username*|npm_config_*otp*|npm_config_*certfile*|npm_config_*keyfile*)
        echo "ERROR: nonempty npm auth-bearing environment config: $name" >&2
        bad=1
        ;;
    esac
  done < <(compgen -e)
  return $bad
}

status=0
if [ "$#" -gt 0 ]; then
  i=0
  for f in "$@"; do
    i=$((i + 1))
    check_file "file$i" "$f" || status=1
  done
else
  check_file repository "$PWD/.npmrc" || status=1
  check_file user "$(npm config get userconfig)" || status=1
  check_file global "$(npm config get globalconfig)" || status=1
fi
check_env || status=1

if [ "$status" -eq 0 ]; then
  echo "no nonempty npm auth-bearing config found (OK)"
fi
exit $status
