# Pico Specification

## 1. Overview

Pico is a small static frontend app for collecting short personal notes and task
fragments. It stays intentionally narrow so one person can operate it without a
separate backend.

## 2. Runtime

- React SPA
- Vite build
- GitHub Pages deployment
- Custom domain: `https://pico.jjgo.io`
- Authentication and storage: `https://ohmesh.jjgo.io`

## 3. Product Scope

Pico supports:

- OAuth login through ohmesh
- Local browser storage while signed out
- Per-user ohmesh JSON storage while signed in
- Creating, editing, completing, searching, and deleting short items
- `/version.json` for deployed version metadata

Pico does not support:

- Shared workspaces
- Team permissions
- Rich text editing
- File uploads
- A service-specific backend

## 4. ohmesh Contract

Pico uses the ohmesh app slug:

```text
pico
```

Expected registered domains:

```text
https://pico.jjgo.io
http://localhost:5175
```

The app stores one latest record per user.

- Record type: `pico-state`
- Data version: `v: 1`

```json
{
  "v": 1,
  "items": [
    {
      "id": "pico-abc123",
      "title": "Small thing to remember",
      "body": "A short note or task fragment",
      "done": false,
      "createdAt": "2026-05-25T00:00:00.000Z",
      "updatedAt": "2026-05-25T00:00:00.000Z"
    }
  ],
  "updatedAt": "2026-05-25T00:00:00.000Z"
}
```

## 5. Operation Rules

- Public frontend env values live in `.env.example`.
- OAuth secrets stay in ohmesh only.
- GitHub Pages deploys from `main` through `.github/workflows/deploy-pages.yml`.
- User-facing behavior changes must update this file and `README.md`.
