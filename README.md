# Medusa plugin notification emails

Medusa v2 plugin for notification templating with support for:

- email and slack channels
- template types (`system`, `db`, `external`)
- admin template builder (`/app/mpn/templates`)
- workflow-first rendering
- translation overrides and external templates

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

## Documentation

- [Configuration](./docs/configuration.md)
- [Templates](./docs/templates.md)
- [Blocks](./docs/blocks.md)
- [Translations](./docs/translations.md)
- [Admin](./docs/admin.md)
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
