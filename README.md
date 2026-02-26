# Medusa plugin notification

Medusa v2 plugin for building and sending transactional notifications from one place.
It provides a template system, admin builder, and rendering workflows for email and Slack.

## Features

- Build and manage notification templates for two channels: email and Slack
- Use three template sources: built-in (`system`), database-managed (`db`), and code-registered (`external`)
- Build templates quickly with a reusable block system instead of writing full markup from scratch
- Edit `db` templates in Medusa Admin using a block-based builder
- Render notifications through dedicated workflows and pass output to Medusa notification providers
- Customize translations and register external templates without changing core plugin code

## Compatibility

- Medusa: `>= 2.8.8`
- Node.js: `>= 20`

## Installation

```bash
npm install @codee-sh/medusa-plugin-notification-emails
# or
yarn add @codee-sh/medusa-plugin-notification-emails
```

## Basic setup

Register plugin in `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-notification-emails",
      options: {
        customTranslations: {},
        extend: {
          services: [],
        },
      },
    },
  ],
})
```

Then continue with configuration and usage guides in `docs/`.

Template IDs are resolved by prefix:

- IDs starting with `system` or `external` are rendered from the in-memory registry (no DB lookup).
- Other IDs are treated as DB templates and must exist in `mpn_builder_template`.

## Documentation

- [Configuration](./docs/configuration.md)
- [Templates](./docs/templates.md)
- [Blocks](./docs/blocks.md)
- [Translations](./docs/translations.md)
- [Admin](./docs/admin.md)
- [Tests](./docs/tests.md)
- [Creating Templates](./docs/contributing/creating-templates.md)

## Exports

Public entrypoints:

- `@codee-sh/medusa-plugin-notification-emails/workflows`
- `@codee-sh/medusa-plugin-notification-emails/modules/*`
- `@codee-sh/medusa-plugin-notification-emails/providers/*`
- `@codee-sh/medusa-plugin-notification-emails/utils`
- `@codee-sh/medusa-plugin-notification-emails/admin`

## License

MIT

## Author

Codee Team - [https://codee.dev](https://codee.dev)
