#!/bin/bash
# Check that the live site is up and serving the expected commit.
#
#   verify-deploy.sh [--expect-sha SHA] [--wait SECONDS]
#
# Without --expect-sha it only smoke-tests the pages. With it, it also waits
# for /version.json to report that commit (or a descendant of it, so a newer
# push landing mid-wait still counts as deployed). Exit 0 healthy, 1 not.
#
# Environment:
#   SITE_URL         base URL, default https://mathpencil.com
#   POLL_INTERVAL    seconds between version checks, default 20
#   ROUTES           space-separated paths that must return 200
set -euo pipefail

SITE_URL="${SITE_URL:-https://mathpencil.com}"
SITE_URL="${SITE_URL%/}"
POLL_INTERVAL="${POLL_INTERVAL:-20}"
ROUTES="${ROUTES:-/ /tools/ /tools/calculator/ /tools/scientific/ /pre-algebra/ /pre-algebra/solver/ /pre-algebra/introduction/ /contact/ /ads.txt}"
EXPECT_SHA=""
WAIT=0

while [ $# -gt 0 ]; do
  case "$1" in
    --expect-sha) EXPECT_SHA="${2:?--expect-sha needs a value}"; shift 2 ;;
    --wait) WAIT="${2:?--wait needs a value}"; shift 2 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

CURL=(curl --silent --show-error --location --max-time 20)

# The commit the live site reports, or empty when version.json is missing or
# malformed. The query string defeats any cache between here and nginx.
live_sha() {
  "${CURL[@]}" --fail "${SITE_URL}/version.json?t=$(date +%s)" 2>/dev/null \
    | sed -n 's/.*"commit"[[:space:]]*:[[:space:]]*"\([0-9a-f]\{7,40\}\)".*/\1/p' \
    | head -n 1
}

# True when the live commit is EXPECT_SHA itself or builds on top of it.
is_deployed() {
  local live="$1"
  [ -n "$live" ] || return 1
  case "$EXPECT_SHA" in "$live"*) return 0 ;; esac
  case "$live" in "$EXPECT_SHA"*) return 0 ;; esac
  git cat-file -e "${EXPECT_SHA}^{commit}" 2>/dev/null \
    && git cat-file -e "${live}^{commit}" 2>/dev/null \
    && git merge-base --is-ancestor "$EXPECT_SHA" "$live" 2>/dev/null
}

if [ -n "$EXPECT_SHA" ]; then
  deadline=$(( $(date +%s) + WAIT ))
  while :; do
    live="$(live_sha || true)"
    if is_deployed "$live"; then
      echo "version.json reports ${live:0:7}; expected ${EXPECT_SHA:0:7} is live."
      break
    fi
    echo "live is ${live:-unreadable}, waiting for ${EXPECT_SHA:0:7} ..."
    if [ "$(date +%s)" -ge "$deadline" ]; then
      echo "FAIL: ${SITE_URL} did not reach ${EXPECT_SHA:0:7} within ${WAIT}s" >&2
      exit 1
    fi
    sleep "$POLL_INTERVAL"
  done
fi

failed=0
for route in $ROUTES; do
  code="$("${CURL[@]}" --output /dev/null --write-out '%{http_code}' "${SITE_URL}${route}" || true)"
  if [ "$code" = "200" ]; then
    echo "ok   ${route} 200"
  else
    echo "FAIL ${route} ${code:-no response}" >&2
    failed=1
  fi
done

# A 200 with an empty or generic body means nginx is up but the site is not.
title="$("${CURL[@]}" "${SITE_URL}/" | sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p' | head -n 1 || true)"
if [ -z "$title" ]; then
  echo "FAIL / has no <title>" >&2
  failed=1
else
  echo "ok   / title: ${title}"
fi

exit "$failed"
