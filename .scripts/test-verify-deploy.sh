#!/bin/bash
# Tests for verify-deploy.sh and the marker logic in deploy.sh / poll-deploy.sh.
# Needs only bash, git, curl and python3. No network: a local fixture server
# stands in for the site. Run: .scripts/test-verify-deploy.sh
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERIFY="$HERE/verify-deploy.sh"
WORK="$(mktemp -d)"
SERVER_PID=""
PASS=0
FAIL=0

cleanup() {
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null
  rm -rf "$WORK"
}
trap cleanup EXIT

ok()   { PASS=$((PASS + 1)); echo "  pass: $1"; }
bad()  { FAIL=$((FAIL + 1)); echo "  FAIL: $1" >&2; }
expect_rc() { # name expected-rc actual-rc
  if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 (wanted rc $2, got $3)"; fi
}

# --- a throwaway git history so descendant checks have real commits ---------
REPO="$WORK/repo"
git init -q "$REPO"
git -C "$REPO" -c user.email=t@t -c user.name=t commit -q --allow-empty -m one
PARENT="$(git -C "$REPO" rev-parse HEAD)"
git -C "$REPO" -c user.email=t@t -c user.name=t commit -q --allow-empty -m two
CHILD="$(git -C "$REPO" rev-parse HEAD)"

# --- fixture site -----------------------------------------------------------
SITE="$WORK/site"
mkdir -p "$SITE/contact" "$SITE/scientific" "$SITE/pre-algebra"
for p in index.html contact/index.html scientific/index.html pre-algebra/index.html; do
  echo '<html><head><title>fixture</title></head></html>' > "$SITE/$p"
done
echo 'google.com, pub-0, DIRECT' > "$SITE/ads.txt"

PORT="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1",0)); print(s.getsockname()[1]); s.close()')"
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$SITE" >/dev/null 2>&1 &
SERVER_PID=$!
export SITE_URL="http://127.0.0.1:${PORT}"
for _ in $(seq 1 50); do curl -s -o /dev/null "$SITE_URL/" && break; sleep 0.1; done

set_version() { printf '{"commit":"%s","builtAt":"2026-10-17T00:00:00Z"}\n' "$1" > "$SITE/version.json"; }
run_verify() { (cd "$REPO" && POLL_INTERVAL=1 "$VERIFY" "$@" >/dev/null 2>&1); echo $?; }

echo "verify-deploy.sh"

rm -f "$SITE/version.json"
expect_rc "smoke test passes without --expect-sha" 0 "$(run_verify)"

set_version "$CHILD"
expect_rc "exact commit match" 0 "$(run_verify --expect-sha "$CHILD" --wait 3)"
expect_rc "short sha prefix match" 0 "$(run_verify --expect-sha "${CHILD:0:7}" --wait 3)"
expect_rc "live is a descendant of expected" 0 "$(run_verify --expect-sha "$PARENT" --wait 3)"

set_version "$PARENT"
expect_rc "live is behind expected, times out" 1 "$(run_verify --expect-sha "$CHILD" --wait 2)"

rm -f "$SITE/version.json"
expect_rc "missing version.json times out" 1 "$(run_verify --expect-sha "$CHILD" --wait 2)"

echo 'not json' > "$SITE/version.json"
expect_rc "malformed version.json times out" 1 "$(run_verify --expect-sha "$CHILD" --wait 2)"

# Arrives mid-wait: the deploy lands a few seconds after the check starts.
set_version "$PARENT"
( sleep 2; set_version "$CHILD" ) &
LATE_PID=$!
expect_rc "waits for a deploy that lands late" 0 "$(run_verify --expect-sha "$CHILD" --wait 10)"
wait "$LATE_PID"

set_version "$CHILD"
mv "$SITE/contact" "$WORK/contact.off"
expect_rc "a missing route fails" 1 "$(run_verify)"
mv "$WORK/contact.off" "$SITE/contact"

echo '<html><body>no title</body></html>' > "$SITE/index.html"
expect_rc "a page with no <title> fails" 1 "$(run_verify)"
echo '<html><head><title>fixture</title></head></html>' > "$SITE/index.html"

expect_rc "unknown argument is rejected" 2 "$(run_verify --bogus)"

expect_rc "unreachable site fails" 1 "$(SITE_URL=http://127.0.0.1:1 run_verify)"

# --- the marker deploy.sh writes must be what verify-deploy.sh reads --------
echo "deploy.sh marker"
MARKER_CMD="$(sed -n '/^printf .{"commit"/,/version\.json$/p' "$HERE/deploy.sh")"
if [ -n "$MARKER_CMD" ]; then
  mkdir -p "$REPO/build/client"
  (cd "$REPO" && bash -c "$MARKER_CMD")
  cp "$REPO/build/client/version.json" "$SITE/version.json"
  expect_rc "deploy.sh marker is accepted by verify-deploy.sh" 0 "$(run_verify --expect-sha "$CHILD" --wait 3)"
else
  bad "could not find the version.json printf in deploy.sh"
fi

# --- poll-deploy.sh decides on the marker -----------------------------------
echo "poll-deploy.sh"
ORIGIN="$WORK/origin.git"
git init -q --bare -b main "$ORIGIN"
CHECKOUT="$WORK/checkout"
git clone -q "$ORIGIN" "$CHECKOUT" 2>/dev/null
mkdir -p "$CHECKOUT/.scripts"
cp "$HERE/poll-deploy.sh" "$CHECKOUT/.scripts/"
printf '#!/bin/bash\necho DEPLOY-RAN\n' > "$CHECKOUT/.scripts/deploy.sh"
chmod +x "$CHECKOUT/.scripts/"*.sh
git -C "$CHECKOUT" add -A
git -C "$CHECKOUT" -c user.email=t@t -c user.name=t commit -q -m init
git -C "$CHECKOUT" push -q origin HEAD:main
HEAD_SHA="$(git -C "$CHECKOUT" rev-parse HEAD)"
WEBROOT="$WORK/webroot"
mkdir -p "$WEBROOT"

poll() { REPO_DIR="$CHECKOUT" WEBROOT="$WEBROOT" "$CHECKOUT/.scripts/poll-deploy.sh" 2>&1; }
deploys() { poll | grep -c DEPLOY-RAN; }

echo x > "$WEBROOT/index.html"
printf '{"commit":"%s"}\n' "$HEAD_SHA" > "$WEBROOT/version.json"
[ "$(deploys)" = "0" ] && ok "up to date and marker matches: no deploy" || bad "redeployed when already current"

printf '{"commit":"%s"}\n' "$PARENT" > "$WEBROOT/version.json"
[ "$(deploys)" = "1" ] && ok "stale marker: redeploys" || bad "did not redeploy on a stale marker"

rm -f "$WEBROOT/version.json"
[ "$(deploys)" = "1" ] && ok "missing marker: redeploys" || bad "did not redeploy when marker missing"

rm -f "$WEBROOT/index.html"
printf '{"commit":"%s"}\n' "$HEAD_SHA" > "$WEBROOT/version.json"
[ "$(deploys)" = "1" ] && ok "missing index.html: redeploys" || bad "did not redeploy when index.html missing"

echo
echo "${PASS} passed, ${FAIL} failed"
[ "$FAIL" -eq 0 ]
