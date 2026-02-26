# AGENTS.md

Instructions for AI coding agents working on this repository.

## Project Overview

Medusa plugin for building and sending transactional notifications.
Renders notification content through workflows. 
Delivery is handled by Medusa notification providers.

- Package: `@codee-sh/medusa-plugin-notification-emails`
- Medusa: `>= 2.8.8`
- Node.js: `>= 20`
- Package manager: `yarn` (v3, see `.yarnrc.yml`)

## Scripts

```bash
yarn install            # install dependencies
yarn build              # build plugin (medusa plugin:build)
yarn dev                # develop plugin (medusa plugin:develop)
yarn prepublishOnly     # build before publish (medusa plugin:build)
yarn publish-local      # publish locally (npx medusa plugin:publish)
yarn publish-package    # publish to npm (dotenv npm publish --access public)
yarn email:dev          # preview email templates (react-email dev server)
```

## Code Style

- Prettier: 60-char print width, no semicolons, double quotes, trailing commas (es5)
- Config: `.prettierrc`
- TypeScript: ES2021, Node16 modules, strict null checks, decorators enabled
- Config: `tsconfig.json`

## Branch Model

- `main` — release-ready, every commit is tagged and deployable
- `develop` — nightly builds and upcoming release work
- Topic branches: `feat/<name>`, `fix/<name>`, `chore/<name>`, `docs/<name>`
- PRs target `develop` by default
- Hotfixes branch from `main`, merge back to `main` and `develop`

## Versioning and Release

- Uses [Changesets](https://github.com/changesets/changesets) for version management
- Add changeset: `yarn changeset`
- Version bump: `yarn changeset version`
- Release: merge release branch to `main`, tag is created automatically
- CI: GitHub Actions for PR labeling and release-on-merge

## Architecture

### High-Level Flow

```
Event (e.g. order.placed)
  → Subscriber
    → Rendering Workflow (emailServiceWorkflow / slackServiceWorkflow)
      → Template resolve (system / db / external)
        → Block interpolation ({{data.*}}, {{translations.*}})
          → Channel-specific render (HTML for email, Block Kit for Slack)
            → Medusa Notification Module (delivery)
```

### Source Tree

```
src/
├── admin/              # Admin panel UI (React, builder, routes, widgets)
├── api/                # Admin API routes (/api/admin/mpn/...)
├── hooks/              # React hooks for API calls
├── modules/
│   └── mpn-builder/    # Core module: models, services, migrations
├── subscribers/        # Medusa event subscribers (order-placed, order-completed)
├── templates/
│   ├── emails/         # Email templates (system) + React Email block components
│   ├── slack/          # Slack templates (system) + Block Kit format
│   └── shared/         # Shared template utilities, theme, abstract services
├── utils/              # Helpers: i18n, transforms, data modules, DnD
└── workflows/
    ├── mpn-builder/          # Template CRUD workflows
    ├── mpn-builder-services/ # Rendering workflows (email-service, slack-service)
    ├── order/                # Order data workflows
    ├── region/               # Region data workflows
    └── store/                # Store data workflows
```

### Key Modules

| Module | Path | Purpose |
|--------|------|---------|
| `mpn-builder` | `src/modules/mpn-builder/` | Core: DB models, template services, migrations |
| Email service | `src/modules/mpn-builder/services-local/email-template-service.ts` | System email templates + block schema definitions |
| Slack service | `src/modules/mpn-builder/services-local/slack-template-service.ts` | System Slack templates + block schema definitions |
| Email workflows | `src/workflows/mpn-builder-services/email-service.ts` | `emailServiceWorkflow` — render email templates |
| Slack workflows | `src/workflows/mpn-builder-services/slack-service.ts` | `slackServiceWorkflow` — render Slack templates |

### Template Types

| Type | Prefix | Source | Editable in Admin |
|------|--------|--------|-------------------|
| `system` | `system_*` | Code (`src/templates/`) | No (read-only) |
| `db` | (any other ID) | Database via Admin builder | Yes |
| `external` | `external_*` | External packages via config | No |

### Template Resolution

- `template_id` starting with `system_` → code registry
- Other IDs → DB lookup
- `external` templates available in service registry when registered in plugin config

### Blocks

- DB model is channel-agnostic: `type`, `position`, `parent_id`, `metadata`
- Final render is channel-specific (email → React Email HTML, Slack → Block Kit JSON)
- Email block types: `section`, `heading`, `text`, `row`, `separator`, `group`, `repeater`, `product-item`
- Slack block types: `header`, `section`, `actions`, `divider` (Block Kit standard)

### Interpolation

Two-prefix system processed recursively:
- `{{data.*}}` — values from template input data
- `{{translations.*}}` — values from translation dictionaries (system/external templates)

For `db` templates: use `{{data.*}}` and literal text in block `metadata`.
Do not rely on `{{translations.*}}`.

### i18n

- Translation files: JSON with `general` wrapper, auto-flattened
- Location: `src/templates/<channel>/<template>/translations/`
- Custom overrides via plugin config (`customTranslations`) or per-render `options.translations`

## Admin API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/mpn/templates` | List DB templates |
| POST | `/api/admin/mpn/templates` | Create DB template |
| GET | `/api/admin/mpn/templates/:id/blocks` | Get template blocks |
| POST | `/api/admin/mpn/templates/:id/blocks` | Save template blocks |
| GET | `/api/admin/mpn/templates/types` | List template types |
| GET | `/api/admin/mpn/templates/types/:type/services` | Services by type |
| GET | `/api/admin/mpn/templates/types/:type/services/:service/templates` | Templates by type+service |
| GET | `/api/admin/mpn/available-templates` | Template services and builder metadata |
| GET | `/api/admin/mpn/notifications` | Notification history |
| GET | `/api/admin/mpn/events` | Available events |
| POST | `/api/admin/mpn/render-template` | Render template preview |


## Documentation

- `README.md` — overview, install, basic setup
- `docs/configuration.md` — plugin options
- `docs/templates.md` — template types, workflows, API
- `docs/blocks.md` — block system, DB model, final catalog
- `docs/translations.md` — i18n system, interpolation
- `docs/admin.md` — admin panel user guide
- `docs/tests.md` — tests guide
- `docs/contributing/creating-templates.md` — contributor template guide
- `CONTRIBUTING.md` — branch model, PR rules, release process

## AI Skills

Project skills are in `.ai/skills/` (symlinked to `.cursor/skills/` and `.codex/skills/`).

| Skill | When to use |
|-------|-------------|
| `docs` | Writing or updating documentation |

## Rules for Agents

1. Always run `yarn format` before committing.
2. Follow the branch model: feature work from `develop`, PRs to `develop`.
3. Add a changeset (`yarn changeset`) for any user-facing change.
4. Use consistent terminology: `system`, `db`, `external`, `blocks`, `mpn-builder`, `workflow`.
5. When changing docs, follow the `docs` skill.
6. Do not commit `.env`, `node_modules`, `.medusa/`, or build artifacts.
