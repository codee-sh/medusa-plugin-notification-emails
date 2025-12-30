# Medusa plugin notification emails

A comprehensive notification plugin for Medusa v2 that provides a flexible, block-based template system for multiple channels (Email and Slack) with internationalization support, custom translations, and seamless integration with Medusa's notification module.

## Features

- **Multi-Channel Templates**: Pre-built templates for Email and Slack channels
- **Block-Based System**: Templates are built using a flexible block system that can be stored in a database for future builder functionality
- **Email Templates**: Customizable email templates built with [React Email](https://react.email) for common use cases
- **Slack Templates**: Slack Block Kit compatible templates for Slack notifications
- **Template Service Architecture**: Unified `AbstractTemplateService` with channel-specific implementations (`EmailTemplateService`, `SlackTemplateService`)
- **Automatic Interpolation**: Smart variable interpolation system that processes `{{data.*}}` and `{{translations.*}}` placeholders recursively
- **Internationalization**: Built-in support for multiple locales (Polish, English)
- **Customizable**: Override translations and customize templates without modifying core files
- **Integration**: Integrates with Medusa's notification module
- **Admin Panel**: Preview and test templates directly from Medusa Admin
- **Type-Safe**: Full TypeScript support with exported types
- **HTML & Plain Text**: Automatically generates both HTML and plain text versions of emails

## Compatibility

- **Medusa Version**: `>= 2.8.8`
- **Node Version**: `>= 20`

## Installation

```bash
npm install @codee-sh/medusa-plugin-notification-emails
# or
yarn add @codee-sh/medusa-plugin-notification-emails
```

## Quick Start

### 1. Register the Plugin

Add to your `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  plugins: [
    "@codee-sh/medusa-plugin-notification-emails"
  ]
})
```

### 2. Configure Notification Provider

Set up a notification provider - see [Configuration Documentation](./docs/configuration.md) for details.

### 3. Use Templates

The plugin includes built-in subscribers that automatically send email notifications for various events. You can also use templates directly in your code:

#### Email Templates

```typescript
import { emailService, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"

const { html, text, subject } = await emailService.render({
  templateName: TEMPLATES_NAMES.ORDER_PLACED,
  data: templateData,
  options: { locale: "pl" }
})
```

#### Slack Templates

```typescript
import { slackService, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification-emails/templates/slack"

const { blocks } = await slackService.render({
  templateName: TEMPLATES_NAMES.INVENTORY_LEVEL,
  data: templateData,
  options: { locale: "en" }
})
```

**Note**: Templates use a block-based system where each template is defined as an array of blocks. The system automatically interpolates variables like `{{data.order.id}}` and `{{translations.headerTitle}}` throughout the blocks.

See [Templates Documentation](./docs/templates.md) for detailed usage examples.

## Available Templates

### Email Templates

- **[Order Placed](./docs/templates/order-placed.md)** (`order-placed`) - Order confirmation email template
- **Order Completed** (`order-completed`) - Order completion notification template
- **[Contact Form](./docs/templates/contact-form.md)** (`contact-form`) - Contact form submission email template
- **Order Updated** (`order-updated`) - Order update notification template
- **Inventory Level** (`inventory-level`) - Inventory level notification template

### Slack Templates

- **Inventory Level** (`inventory-level`) - Inventory level notification for Slack
- **Product** (`product`) - Product notification for Slack
- **Product Variant** (`product-variant`) - Product variant notification for Slack

See [Templates Documentation](./docs/templates.md) for general template information and [Blocks Documentation](./docs/blocks.md) for details on the block system.

## Built-in Subscribers

The plugin includes automatic email notifications for the following events:

- **`order.placed`** - Sends order confirmation email when an order is placed
- **`order.completed`** - Sends order completion notification when an order is completed

These subscribers automatically:
- Fetch order data from Medusa
- Render email templates using React Email
- Send notifications via Medusa's notification module
- Respect custom translations configured in plugin options

See [Configuration Documentation](./docs/configuration.md) for details on customizing subscriber behavior.

## Admin Panel

Access the template preview in Medusa Admin at `/app/notifications/render`. See [Admin Panel Documentation](./docs/admin.md) for details.

## Documentation

- [Templates](./docs/templates.md) - Using templates and creating custom subscribers
- [Blocks System](./docs/blocks.md) - Understanding the block-based template system
- [Translations](./docs/translations.md) - Internationalization and custom translations
- [Configuration](./docs/configuration.md) - Plugin configuration options
- [Admin Panel](./docs/admin.md) - Admin interface usage
- [Creating Custom Templates](./docs/contributing/creating-templates.md) - Guide for creating new templates

## Exports

The plugin exports the following:

- `@codee-sh/medusa-plugin-notification-emails/templates/emails` - Email template service and types
- `@codee-sh/medusa-plugin-notification-emails/templates/slack` - Slack template service and types
- `@codee-sh/medusa-plugin-notification-emails/templates/shared` - Shared template utilities
- `@codee-sh/medusa-plugin-notification-emails/utils` - Utility functions

## License

MIT

## Author

Codee Team - [https://codee.dev](https://codee.dev)
