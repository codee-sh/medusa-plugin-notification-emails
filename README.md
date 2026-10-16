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

`react` and `react-dom` are peer dependencies: the email renderer needs them at runtime. Keep them in
your application's `dependencies`, not `devDependencies` - Medusa Cloud does not install development
dependencies. The plugin pins `@react-email/components` 0.3.3 and `@react-email/render` 1.1.4, the
versions [Medusa Cloud supports](https://docs.medusajs.com/cloud/emails/react-email).

## Basic setup

Register plugin in `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-notification-emails",
      options: {
        // The plugin's order emails are opt-in, see docs/configuration.md
        subscribers: {},
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

The plugin sends nothing on its own unless you enable its subscribers. To render an email in your
own code, run `emailServiceWorkflow` and pass the result to the Notification Module:

```typescript
import { emailServiceWorkflow } from "@codee-sh/medusa-plugin-notification-emails/workflows"

const {
  result: { subject, html, text },
} = await emailServiceWorkflow(container).run({
  input: { template_id: "external_order-summary", data, options: { locale: "en" } },
})
```

## Upgrading from 1.0.x

- **Order emails are opt-in.** The `order.placed` and `order.completed` subscribers no longer
  email customers by default. Add `subscribers` to keep order emails:

  ```typescript
  subscribers: {
    "order.placed": { enabled: true, locale: "pl" },
    "order.completed": { enabled: true, locale: "pl" },
  }
  ```

  1.0.x sent them in `pl`; the default locale is now `en`.
- **Data values are HTML-escaped** in `text`, `row` and `product-item` values. Put markup in
  translations, not in data.
- **Missing data renders empty.** A `{{data.*}}` placeholder with no value renders as an empty
  string, and a `heading`, `text` or `row` left empty is not rendered.
- **The Builder - Lexical admin page is removed.**

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

- `@codee-sh/medusa-plugin-notification-emails/workflows` - `emailServiceWorkflow`, `slackServiceWorkflow` and their input types (`EmailServiceWorkflowInput`, `EmailServiceWorkflowOutput`, `SlackServiceWorkflowInput`)
- `@codee-sh/medusa-plugin-notification-emails/modules/*`
- `@codee-sh/medusa-plugin-notification-emails/providers/*`
- `@codee-sh/medusa-plugin-notification-emails/utils`
- `@codee-sh/medusa-plugin-notification-emails/admin`

## License

MIT

## Author

Codee Team - [https://codee.dev](https://codee.dev)
