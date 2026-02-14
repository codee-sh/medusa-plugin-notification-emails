# Templates Documentation

This plugin supports three template sources in `v1.0.0`:

- `system` - built-in templates shipped with the plugin
- `db` - templates created and edited in the builder (stored in database)
- `external` - templates registered from your own packages/files via plugin options

The primary rendering path is workflow-based and uses `template_id`.

## Template Types and Services

### Template types

- `system`
- `db`
- `external`

### Template services (channels)

- `email`
- `slack`

Type/service combinations are available through Admin API:

- `GET /api/admin/mpn/templates/types`
- `GET /api/admin/mpn/templates/types/:type/services`
- `GET /api/admin/mpn/templates/types/:type/services/:service/templates`

## How templates are resolved at runtime

Rendering workflows read `template_id` and resolve source automatically:

- `template_id` starting with `system_` -> `system` template registry
- any other `template_id` -> DB lookup (`db` template)
- `external` templates are available in service registry when registered in config

Main workflows:

- `emailServiceWorkflow` (`mpn-builder-email-service`)
- `slackServiceWorkflow` (`mpn-builder-slack-service`)

## Translations vs locale by template type

`v1.0.0` uses two different mechanisms depending on template source:

- `system` and `external` templates: can use `{{translations.*}}`, because they provide translation dictionaries in template config
- `db` templates: language is selected by template `locale` stored in DB (`channel` + `locale` are set during template creation)

In practice for `db` templates:

- prefer `{{data.*}}` and explicit text in block `metadata`
- do not rely on `{{translations.*}}` in DB block payload
- create separate DB templates per language when needed (e.g. `pl`, `en`)

## Creating templates

## 1) System templates (code-owned)

Use this when template should be part of plugin codebase and versioned with release.

System templates are registered inside local services:

- `src/modules/mpn-builder/services-local/email-template-service.ts`
- `src/modules/mpn-builder/services-local/slack-template-service.ts`

Each template provides:

- `blocks`
- `translations`

Example IDs:

- email: `system_order-placed`, `system_contact-form`
- slack: `system_inventory-level`, `system_product`

System templates are read-only from builder DB perspective.

## 2) DB templates (builder-owned)

Use this when template should be editable from Admin UI.

### Create template record

Endpoint:

- `POST /api/admin/mpn/templates`

Payload shape:

```typescript
{
  items: [
    {
      name: "my-order-template",
      label: "My order template",
      description: "DB editable template",
      channel: "email", // or "slack"
      locale: "pl", // language assigned to this DB template
      subject: "Order {{data.order.id}}",
      is_active: true
    }
  ]
}
```

### Save/update blocks

Endpoint:

- `POST /api/admin/mpn/templates/:id/blocks`

Payload shape:

```typescript
{
  template_id: "tmpl_123",
  blocks: [
    {
      type: "heading",
      position: 0,
      parent_id: null,
      metadata: {
        value: "Podsumowanie zamowienia"
      }
    },
    {
      type: "row",
      position: 1,
      parent_id: null,
      metadata: {
        label: "Numer zamowienia",
        value: "{{data.order.transformed.order_number}}"
      }
    }
  ]
}
```

DB model stores blocks as:

- `type`
- `position`
- `parent_id`
- `metadata` (block config)

## 3) External templates (config-owned)

Use this when templates live outside plugin repo (e.g. dedicated package).

Register via `options.extend.services` in `medusa-config.ts`:

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
              id: "email",
              templates: [
                {
                  name: "external_order-summary",
                  path: path.resolve(
                    require.resolve("@your-scope/templates/email/order-summary")
                  )
                }
              ]
            }
          ]
        }
      }
    }
  ]
})
```

After registration, template becomes available as type `external` for that service.

## Rendering templates in your code

### Email workflow

```typescript
import { emailServiceWorkflow } from "@codee-sh/medusa-plugin-notification-emails/workflows/mpn-builder-services/email-service"

const {
  result: { html, text, subject },
} = await emailServiceWorkflow(container).run({
  input: {
    template_id: "system_order-placed", // or db template id
    data: templateData,
    options: {
      locale: "en",
      translations: {
        headerTitle: "Custom title"
      }
    }
  }
})
```

### Slack workflow

```typescript
import { slackServiceWorkflow } from "@codee-sh/medusa-plugin-notification-emails/workflows/mpn-builder-services/slack-service"

const {
  result: { blocks },
} = await slackServiceWorkflow(container).run({
  input: {
    template_id: "system_inventory-level",
    data: templateData,
    options: {
      locale: "en"
    }
  }
})
```

## Working with template lists

Useful API endpoints:

- `GET /api/admin/mpn/templates` - DB templates
- `GET /api/admin/mpn/templates/types` - available template types
- `GET /api/admin/mpn/templates/types/:type/services` - services by type
- `GET /api/admin/mpn/templates/types/:type/services/:service/templates` - templates by type+service
- `GET /api/admin/mpn/available-templates` - template services and builder metadata

## Custom subscribers (workflow-first)

In custom subscriber logic, call rendering workflow first, then pass rendered content to notification module.

```typescript
import { Modules } from "@medusajs/framework/utils"
import { emailServiceWorkflow } from "@codee-sh/medusa-plugin-notification-emails/workflows/mpn-builder-services/email-service"

export default async function customEventHandler({ event: { data }, container }: any) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  const {
    result: { html, text, subject },
  } = await emailServiceWorkflow(container).run({
    input: {
      template_id: "system_contact-form",
      data: {
        name: "System Notification",
        email: "system@example.com",
        message: data.message,
      },
      options: { locale: "en" },
    },
  })

  await notificationModuleService.createNotifications({
    to: "admin@example.com",
    channel: "email",
    content: { subject, html, text },
  })
}
```

## Best Practices

1. Prefer workflow-based rendering (`emailServiceWorkflow`, `slackServiceWorkflow`)
2. Use `system` for release-owned templates, `db` for admin-editable templates, `external` for package-owned templates
3. Keep template IDs stable and explicit (`system_*` for built-ins)
4. For `db` templates keep user-facing text directly in block `metadata` and control language through template `locale`
5. Validate template data shape before rendering
6. Test rendering for all locales and for each template source (`system/db/external`)

## See Also

- [Blocks Documentation](./blocks.md) - Block types, behavior, and DB structure
- [Translations Documentation](./translations.md) - Interpolation and translation overrides
- [Configuration Documentation](./configuration.md) - Plugin options and external template registration
- [Creating Custom Templates](./contributing/creating-templates.md) - Contributor-focused guide
