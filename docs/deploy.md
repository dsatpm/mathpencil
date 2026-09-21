# Deploying mathpencil.com

## How it works

`mathpencil.com` is a **pre-rendered static site**. No route uses a `loader` or
`action`, so `react-router.config.ts` sets `ssr: false` with `prerender: true`.
`npm run build` writes real HTML to `build/client`:

```
build/client/index.html           # /
build/client/contact/index.html   # /contact
build/client/__spa-fallback.html  # client-side fallback
build/client/assets/...           # hashed JS + CSS
```

nginx serves that directory directly. There is no Node process in production,
nothing to keep alive, and no `proxy_pass`.

## Host

| | |
|---|---|
| VPS | `srv1704054` (Hostinger, KVM 2, Ubuntu 26.04) |
| IP | `2.25.131.201` — both `@` and `www` A records point here |
| Webroot | `/var/www/mathpencil` |
| Checkout | `/root/projects/mathpencil` |

The second VPS, `srv1995537` (`177.7.33.46`, Debian 13), is **not** part of this
deployment.

## Pipeline — pull, not push

The server polls. GitHub never connects inward.

A systemd timer runs `.scripts/poll-deploy.sh` every two minutes. It compares
`HEAD` against `origin/main` and exits immediately when they match and
`index.html` is present. When they differ it hands off to `.scripts/deploy.sh`,
which fetches, hard-resets, runs `npm ci` and `npm run build`, then rsyncs
`build/client/` into the webroot.

This replaced an `appleboy/ssh-action` workflow. That design needed an inbound
SSH key, a `HOST`/`PORT`/`USERNAME`/`SSHKEY` secret set, and a firewall that
tolerates connections from GitHub's rotating Azure IP pool — every one of which
broke in practice. Polling needs none of it: no CI key to rotate, no inbound
port to expose, nothing to un-ban. Latency is the tradeoff: up to two minutes
between merge and live.

`.github/workflows/ci.yml` still runs on push and PR, but only typechecks and
builds. It holds no secrets and never touches the server. Because `main` deploys
automatically, that gate is what keeps a broken build off the box.

> `deploy.sh` runs `git reset --hard origin/main`. Any edit made directly on the
> server inside `/root/projects/mathpencil` is discarded on the next poll. Treat
> that checkout as disposable — change code in the repo, not there.

## One-time server setup

```bash
install -m 644 /root/projects/mathpencil/.scripts/systemd/mathpencil-deploy.service \
               /etc/systemd/system/mathpencil-deploy.service
install -m 644 /root/projects/mathpencil/.scripts/systemd/mathpencil-deploy.timer \
               /etc/systemd/system/mathpencil-deploy.timer

systemctl daemon-reload
systemctl enable --now mathpencil-deploy.timer
```

Force an immediate run rather than waiting for the timer:

```bash
systemctl start mathpencil-deploy.service
journalctl -u mathpencil-deploy.service -f
```

Check the schedule:

```bash
systemctl list-timers mathpencil-deploy.timer
```

`Type=oneshot` means systemd will not start a second run while one is in
flight, so a slow build cannot overlap itself.

## Decommissioning the old SSH path

Once the timer is confirmed working, the deploy secrets are dead weight and
should go — they are standing inbound credentials with no remaining use:

```bash
gh secret delete HOST
gh secret delete PORT
gh secret delete USERNAME
gh secret delete SSHKEY
```

And on the server, drop the CI key from `authorized_keys`:

```bash
grep -v "github-actions-mathpencil" /root/.ssh/authorized_keys > /tmp/ak && \
  mv /tmp/ak /root/.ssh/authorized_keys && chmod 600 /root/.ssh/authorized_keys
rm -f /root/.ssh/gha_deploy /root/.ssh/gha_deploy.pub
```

Keep your own personal key in `authorized_keys` — verify you can still log in
from a second terminal **before** closing the one you are in.

## nginx

The vhost lives in `/etc/nginx/sites-available/`. Inspect the live config with:

```bash
nginx -T | grep -A30 'server_name mathpencil.com'
```

Keep the certbot-managed `listen 443` and `ssl_certificate` lines. The parts
that matter for a pre-rendered site:

```nginx
root /var/www/mathpencil;
index index.html;

location / {
    try_files $uri $uri/ $uri/index.html /__spa-fallback.html;
}

# Hashed filenames, safe to cache hard
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML must not be cached, or deploys won't be picked up
location ~* \.html$ {
    add_header Cache-Control "no-cache";
}
```

`try_files $uri /index.html` is **not** sufficient — it never resolves
`/contact/index.html`, and when `index.html` is absent it produces an internal
redirect cycle that nginx reports as a 500.

Apply:

```bash
nginx -t && systemctl reload nginx
```

## Verifying

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://mathpencil.com
curl -sS -o /dev/null -w '%{http_code}\n' https://mathpencil.com/contact
curl -sS https://mathpencil.com | grep -o '<title>[^<]*</title>'
```

Both should be `200`. The webroot should contain `index.html`, `contact/` and
`assets/` — if you see `client/` and `server/` in there, something copied
`build/` instead of `build/client/`.

## Troubleshooting

| Symptom | Cause |
|---|---|
| 403 on `/` | Webroot exists but has no `index.html` — deploy never completed |
| 500 on every path | `try_files` redirect cycle, usually a missing `index.html` |
| 404 on `/contact` only | `try_files` missing the `$uri/index.html` branch |
| Timer runs, nothing changes | Already at `origin/main`; check `git log -1` on the box |
| `npm: command not found` | nvm not sourced — the service sets `NVM_DIR=/root/.nvm` |

Logs for the last few deploys:

```bash
journalctl -u mathpencil-deploy.service --since "1 hour ago"
```
