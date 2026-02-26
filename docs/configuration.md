# Configuration Documentation

This page describes plugin configuration only.

## Plugin registration

Register the plugin in `medusa-config.ts`:

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

## Options

## `customTranslations`

Overrides for translation dictionaries.

Type:

`Record<string, Record<string, Record<string, any>>>`

Guidelines:

- use template id as first key (for example `system_order-placed`)
- use locale (`pl`, `en`, ...) as second key
- provide translation object as value

Example:

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-notification-emails",
      options: {
        customTranslations: {
          "system_order-placed": {
            pl: {
              headerTitle: "#{{data.order.transformed.order_number}} - Zamowienie",
              labels: {
                orderNumber: "Numer zamowienia",
              },
            },
          },
        },
      },
    },
  ],
})
```

More details: [Translations Documentation](./translations.md)

## `backend_url` (project value for links)

In many projects, a backend/admin base URL is stored in plugin options:

```typescript
backend_url: process.env.POS_BACKEND_URL
```

Use this value when your templates build links (especially Slack buttons/URLs), for example via `{{data.backend_url}}` or `{{data.backendUrl}}` in template blocks.

Recommended pattern:

- keep URL in config (`backend_url`)
- pass it to template render input data/options in your project flow
- use consistent variable naming in template blocks

## `extend.services`

Register external templates for services (`email`, `slack`).

Type:

```typescript
{
  extend?: {
    services?: Array<{
      id: string
      templates?: Array<{
        name: string
        path: string
      }>
    }>
  }
}
```

Example:

```typescript
import path from "path"

module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-notification-emails",
      options: {
        extend: {
          services: [
            {
              id: "slack",
              templates: [
                {
                  name: "external_inventory-alert",
                  path: path.resolve(
                    require.resolve("@your-package/templates/slack/inventory-alert")
                  ),
                },
              ],
            },
          ],
        },
      },
    },
  ],
})
```

Notes:

- templates are loaded during module initialization
- if service id is unknown, template registration is skipped
- registered templates are available as type `external`

Template ID resolution:

- IDs starting with `system` or `external` are rendered from the registry and are not looked up in the database.
- Any other ID is treated as a DB template and must exist in `mpn_builder_template`.

## Minimal complete example

```typescript
import path from "path"

module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-notification-emails",
      options: {
        backend_url: process.env.POS_BACKEND_URL,
        customTranslations: {
          "system_order-placed": {
            en: {
              labels: {
                orderNumber: "Order number",
              },
            },
          },
        },
        extend: {
          services: [
            {
              id: "email",
              templates: [
                {
                  name: "external_order-summary",
                  path: path.resolve(
                    require.resolve("@your-scope/templates/email/order-summary")
                  ),
                },
              ],
            },
          ],
        },
      },
    },
  ],
})
```

## Notification providers

This plugin renders notification content.
Delivery is still handled by configured Medusa notification providers.

Provider setup is configured in Medusa modules.

## Troubleshooting

### Translations not applied

- make sure template key in `customTranslations` matches template id used at render time
- verify locale key (`pl`, `en`, ...)
- verify translation keys used in templates exist

### External template not visible

- verify `extend.services[].id` matches a registered service (`email` or `slack`)
- verify `path` resolves correctly and module can be imported
- check startup logs for warning messages during template registration

### Notification not sent

- verify Medusa notification provider is configured and working
- verify your notification flow/subscriber is triggered for expected event

