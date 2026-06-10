# ENV_VARS.md — Environment Variable Reference

This is the canonical source for environment variable and secret configuration.

> **Security rules:**
> - Never commit secret values to source control.
> - `.env.local` must stay uncommitted.
> - `NEXT_PUBLIC_*` variables are browser-visible; never put secrets in them.
> - Rotate any secret that may have been committed.

---

## Variable Matrix

The deployed frontend requires no environment variables. Two variables are needed only by the
on-demand resume-sync script (`npm run sync:resume` / `publish:resume`), never by the site itself.

| Variable | Required | Default | Description | Where set |
|---|---|---|---|---|
| `WAUNDER_BASE_URL` | Only for `sync:resume` | N/A | Public origin of the Waunder web service that receives the resume push (`POST /api/profile/resume`). | Shell env / `.env.local` when running the sync script |
| `WAUNDER_APP_SECRET` | Only for `sync:resume` | N/A | Shared secret (Waunder's `APP_SHARED_SECRET`) used to open a Waunder session for the push. **Secret — never commit.** | Shell env / `.env.local` only |

---

## Local Development Setup

No `.env.local` file is required to run the current frontend portfolio.

If future work adds environment variables:
- document them in the matrix above
- add a committed `.env.example` with placeholder values if useful
- keep real values in `.env.local` or deployment provider secrets only

---

## Per-Environment Summary

| Environment | Required variables |
|---|---|
| Local dev | None |
| Staging | Not documented |
| Production | Not documented |
