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
nothing to keep alive with systemd, and no `proxy_pass`.

## Host

| | |
|---|---|
| VPS | `srv1704054` (Hostinger, KVM 2, Ubuntu 26.04) |
| IP | `2.25.131.201` — both `@` and `www` A records point here |
| Webroot | `/var/www/mathpencil` |
| Checkout | `~/projects/mathpencil` |

## Pipeline

Push to `main` triggers `.github/workflows/deploy.yml`, which SSHes to the VPS
and runs `.scripts/deploy.sh`. That script fetches `main`, runs `npm ci` and
`npm run build`, then rsyncs `build/client/` into the webroot.

> `deploy.sh` runs `git reset --hard origin/main` on the server. Any edit made
> directly on the box inside `~/projects/mathpencil` is discarded on the next
> deploy. Treat that checkout as disposable — change code here, not there.

## Required GitHub secrets

| Secret | Value |
|---|---|
| `HOST` | `2.25.131.201` |
| `USERNAME` | the deploy user on the VPS |
| `PORT` | `22` unless changed |
| `SSHKEY` | the **private** key, whole file |

`SSHKEY` must be the full private key including the header and footer lines:

```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

A missing header line, a missing trailing newline, or pasting the `.pub` file
produces exactly this failure:

```
ssh: handshake failed: ssh: unable to authenticate,
attempted methods [none publickey], no supported methods remain
```

To mint a fresh keypair for CI:

```bash
ssh-keygen -t ed25519 -C "github-actions-mathpencil" -f ~/.ssh/mathpencil_deploy -N ""
ssh-copy-id -i ~/.ssh/mathpencil_deploy.pub DEPLOY_USER@2.25.131.201
gh secret set SSHKEY < ~/.ssh/mathpencil_deploy
```

Verify before relying on it:

```bash
ssh -i ~/.ssh/mathpencil_deploy DEPLOY_USER@2.25.131.201 'echo ok'
```

## Passwordless sudo

Only needed if the `USERNAME` secret is **not** `root`. Root already has this;
adding a sudoers entry for it is a no-op.

`deploy.sh` calls `sudo` for `mkdir`, `rsync` and `chown`. A non-interactive SSH
session cannot answer a password prompt, so grant exactly those commands.

`rsync` is not installed by default on a minimal Ubuntu image — check first, and
confirm the real binary paths, because sudoers matches the literal path and a
`/bin` vs `/usr/bin` mismatch silently fails to grant:

```bash
command -v mkdir rsync chown
apt install -y rsync   # if missing
```

Then `visudo -f /etc/sudoers.d/mathpencil-deploy`, substituting the deploy
username for `DEPLOY_USER` and the paths from `command -v` above:

```
DEPLOY_USER ALL=(root) NOPASSWD: /usr/bin/mkdir, /usr/bin/rsync, /usr/bin/chown
```

Pasting that line verbatim is a syntax error — `DEPLOY_USER` is a placeholder.

```bash
chmod 0440 /etc/sudoers.d/mathpencil-deploy
visudo -c   # validate the whole sudoers tree
```

Verify non-interactively, the way CI will run it:

```bash
sudo -u DEPLOY_USER sudo -n rsync --version >/dev/null && echo ok
```

If that prompts instead of printing `ok`, the deploy will hang until the 10
minute `command_timeout`.

## nginx

The 500 came from nginx, not the app: nothing had ever been published to the
webroot, so `try_files` fell through to a missing `index.html` and looped.
Inspect the live vhost first:

```bash
sudo nginx -T | grep -A30 'server_name mathpencil.com'
```

Keep the existing `listen 443` and certbot `ssl_certificate` lines — TLS on this
host already works. Only the `root` and `location /` blocks need to match:

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

Apply:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Verifying a deploy

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://mathpencil.com
curl -sS https://mathpencil.com | grep -o '<title>[^<]*</title>'
curl -sS -o /dev/null -w '%{http_code}\n' https://mathpencil.com/contact
```

All three should return `200` and the real page title.
