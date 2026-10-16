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

## Options

## `subscribers`

Opt-in switches for the plugin's own subscribers. Each one emails the order's customer, so all of
them are off by default: a subscriber whose event is not set to `enabled: true` returns before it
reads the order or sends anything.

Type:

```typescript
{
  subscribers?: {
    "order.placed"?: { enabled: boolean; locale?: string }
    "order.completed"?: { enabled: boolean; locale?: string }
  }
}
```

| Event | Template | Recipient |
|---|---|---|
| `order.placed` | `system_order-placed` | the order's customer email |
| `order.completed` | `system_order-completed` | the order's customer email |

`locale` selects the translations and the date and amount formatting; it defaults to `en`.

Example:

```typescript
subscribers: {
  "order.placed": { enabled: true, locale: "pl" },
  "order.completed": { enabled: true, locale: "pl" },
}
```

> Upgrading from 1.0.x: these subscribers ran on every order event and used the `pl` locale. Add the
> `subscribers` entries above to keep sending order emails.

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
        // one of the two:
        module?: Record<string, any>
        path?: string
      }>
    }>
  }
}
```

A template is a module with two named exports, `templateBlocks` and `translations` (see
[External templates](./templates.md#3-external-templates-config-owned)). It is given either as:

- `module` - the imported module itself. Use it for a template that lives in your application's
  `src/`: `medusa-config.ts` is compiled together with `src/`, so the import works the same in
  development and after a build.
- `path` - an absolute path, loaded with `require`. A path without extension resolves to `.js`,
  `.ts` (in development) or a directory's `index`. Use it for a template shipped as compiled
  JavaScript in a package, through `require.resolve`.

Example with `module`:

```typescript
import * as orderSummaryTemplate from "./src/notifications/email/order-summary"

module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-notification-emails",
      options: {
        extend: {
          services: [
            {
              id: "email",
              templates: [
                {
                  name: "external_order-summary",
                  module: orderSummaryTemplate,
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

Example with `path`:

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
- a successful load logs `Custom template "<name>" registered for handler "<service>"`; a failed one logs an error naming the template and its source

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
- verify `path` resolves correctly and module can be imported, or pass the template as `module`
- verify the module exports `templateBlocks` and `translations`
- check startup logs for `Failed to load external template` errors

### Notification not sent

- verify Medusa notification provider is configured and working
- verify your notification flow/subscriber is triggered for expected event
- for the plugin's order emails, verify the event is enabled in `subscribers`

