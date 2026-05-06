# ENV_VARS.md — Environment Variable Reference

This is the canonical source for environment variable and secret configuration.

> **Security rules:**
> - Never commit secret values to source control.
> - `.env.local` must stay uncommitted.
> - `NEXT_PUBLIC_*` variables are browser-visible; never put secrets in them.
> - Rotate any secret that may have been committed.

---

## Variable Matrix

This project currently has no required environment variables.

| Variable | Required | Default | Description | Where set |
|---|---|---|---|---|
| None | No | N/A | No runtime environment variables are required for local development. | N/A |

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
