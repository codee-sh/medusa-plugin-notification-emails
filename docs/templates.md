# Templates Documentation

This plugin provides a flexible, block-based template system for multiple channels (Email and Slack). Templates are defined as arrays of blocks with automatic variable interpolation and translation support. This guide explains how to use existing templates in your code and create custom subscribers.

## Template Service Architecture

The plugin uses a service-based architecture with channel-specific template services:

- **`AbstractTemplateService`** - Base abstract class providing common functionality
- **`EmailTemplateService`** - Email template service (extends `AbstractTemplateService`)
- **`SlackTemplateService`** - Slack template service (extends `AbstractTemplateService`)

Each service is a singleton instance exported from the respective channel module:
- `emailService` - Email template service instance
- `slackService` - Slack template service instance

## Available Templates

### Email Templates

- **[Order Placed](./templates/order-placed.md)** (`order-placed`) - Order confirmation email template
- **Order Completed** (`order-completed`) - Order completion notification email template
- **[Contact Form](./templates/contact-form.md)** (`contact-form`) - Contact form submission email template
- **Order Updated** (`order-updated`) - Order update notification template
- **Inventory Level** (`inventory-level`) - Inventory level notification template

### Slack Templates

- **Inventory Level** (`inventory-level`) - Inventory level notification for Slack
- **Product** (`product`) - Product notification for Slack
- **Product Variant** (`product-variant`) - Product variant notification for Slack

## Using Email Templates

### Basic Usage

Use the `emailService` singleton to render email templates:

```typescript
import { emailService, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"

const { html, text, subject } = await emailService.render({
  templateName: TEMPLATES_NAMES.ORDER_PLACED,
  data: {
    order: {
      id: "order_123",
      transformed: {
        order_number: "ORD-12345",
        order_date: "2024-01-15",
        // ... other order data
      }
    }
  },
  options: {
    locale: "pl"
  }
})
```

**Returns**:
- `html` - HTML version of the email (string)
- `text` - Plain text version of the email (string)
- `subject` - Email subject line (string, generated from translations)

### Synchronous Rendering (for Previews)

For React-based previews, use `renderSync`:

```typescript
const { reactNode } = emailService.renderSync({
  templateName: TEMPLATES_NAMES.ORDER_PLACED,
  data: templateData,
  options: { locale: "en" }
})
```

**Returns**:
- `reactNode` - React node for rendering in preview components

## Using Slack Templates

### Basic Usage

Use the `slackService` singleton to render Slack templates:

```typescript
import { slackService, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification-emails/templates/slack"

const { blocks } = await slackService.render({
  templateName: TEMPLATES_NAMES.INVENTORY_LEVEL,
  data: {
    inventory_level: {
      id: "il_123",
      stock_locations: [
        { name: "Warehouse A", quantity: 10 }
      ],
      inventory_item: {
        id: "item_123"
      }
    }
  },
  options: {
    locale: "en"
  }
})
```

**Returns**:
- `blocks` - Array of Slack Block Kit blocks ready to send to Slack API

**Supported locales**: `pl` (Polish), `en` (English, default)

### Custom Blocks

You can override template blocks by providing custom blocks in options:

```typescript
const { html, text, subject } = await emailService.render({
  templateName: TEMPLATES_NAMES.ORDER_PLACED,
  data: templateData,
  options: {
    locale: "pl",
    blocks: [
      {
        type: "section",
        props: {
          blocks: [
            {
              type: "heading",
              props: {
                value: "Custom Header"
              }
            }
          ]
        }
      }
    ]
  }
})
```

When custom blocks are provided, they replace the template's default blocks. Variables in custom blocks are still interpolated automatically.

## Variable Interpolation

Templates use a powerful interpolation system that processes variables in two formats. For detailed information about the interpolation system, see [Translations Documentation](./translations.md).

## Creating Custom Subscribers

You can create your own subscribers that use the plugin's templates. This is useful when you want to send notifications for custom events or with custom logic.

### Example: Custom Email Event Subscriber

```typescript
import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
import { emailService, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"

export default async function customEventHandler({
  event: { data },
  container,
}: SubscriberArgs<{ userId: string, message: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  // Use contact form template for custom notifications
  const { html, text, subject } = await emailService.render({
    templateName: TEMPLATES_NAMES.CONTACT_FORM,
    data: {
      name: "System Notification",
      email: "system@example.com",
      message: data.message,
    },
    options: { locale: "en" }
  })

  await notificationModuleService.createNotifications({
    to: "admin@example.com",
    channel: "email",
    content: {
      subject,
      html,
      text,
    },
  })
}

export const config: SubscriberConfig = {
  event: "custom.event.name",
}
```

### Example: Custom Slack Event Subscriber

```typescript
import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
import { slackService, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification-emails/templates/slack"

export default async function inventoryEventHandler({
  event: { data },
  container,
}: SubscriberArgs<{ inventory_level: any }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  const { blocks } = await slackService.render({
    templateName: TEMPLATES_NAMES.INVENTORY_LEVEL,
    data: {
      inventory_level: data.inventory_level,
    },
    options: { locale: "en" }
  })

  await notificationModuleService.createNotifications({
    to: "#inventory-alerts",
    channel: "slack",
    content: {
      text: "Inventory level update",
      blocks: blocks,
    },
  })
}

export const config: SubscriberConfig = {
  event: "inventory_level.updated",
}
```

## Registering Custom Templates

You can register custom templates at runtime using the service's `registerTemplate` method:

```typescript
import { emailService } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"

// Register a custom template
emailService.registerTemplate("custom-template", {
  ...emailService.getBaseTemplate(),
  getConfig: () => ({
    blocks: [
      {
        type: "section",
        props: {
          blocks: [
            {
              type: "heading",
              props: {
                value: "{{translations.title}}"
              }
            }
          ]
        }
      }
    ],
    translations: {
      pl: {
        general: {
          title: "Tytuł"
        }
      },
      en: {
        general: {
          title: "Title"
        }
      }
    }
  })
})

// Use the custom template
const { html, text, subject } = await emailService.render({
  templateName: "custom-template",
  data: {},
  options: { locale: "pl" }
})
```

## Best Practices

1. **Use existing templates**: Check available templates before creating custom ones
2. **Follow data structure**: Ensure template data matches the expected structure (see template-specific docs)
3. **Handle errors**: Always check if data exists before rendering
4. **Use translations**: Leverage the translation system for multi-language support
5. **Test rendering**: Test templates with sample data before deploying
6. **Use block system**: Define templates as blocks for flexibility and future database storage
7. **Leverage interpolation**: Use `{{data.*}}` and `{{translations.*}}` for dynamic content

## See Also

- [Blocks System Documentation](./blocks.md) - Understanding the block-based template system
- [Template-specific Documentation](./templates/) - Detailed docs for each template
- [Translations Documentation](./translations.md) - How translations and interpolation work
- [Configuration Documentation](./configuration.md) - Plugin configuration
- [Creating Custom Templates](./contributing/creating-templates.md) - Guide for creating new templates
