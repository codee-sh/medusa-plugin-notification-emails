# Creating Custom Templates

This guide explains how to create new templates for the plugin using the block-based system. Templates can be created for both Email and Slack channels.

## Overview

Templates are defined using a block-based system where each template consists of:

- **Blocks Array**: Array of blocks defining the template structure
- **Translations**: Translation files (JSON format) for internationalization
- **Template Registration**: Registration in the template service

The block system automatically handles:
- Variable interpolation (`{{data.*}}` and `{{translations.*}}`)
- Translation merging
- Channel-specific rendering

## Template Structure

Create a new folder in the appropriate channel directory:

**For Email templates**: `src/templates/emails/your-template-name/`
**For Slack templates**: `src/templates/slack/your-template-name/`

Structure:

```
your-template-name/
  ├── config.ts              # Template configuration (blocks + translations)
  ├── translations/          # Translation files
  │   ├── pl.json
  │   ├── en.json
  │   └── index.ts
```

## Step-by-Step Guide

### 1. Create Translation Files

Start by creating translation files in JSON format:

**translations/pl.json**:
```json
{
  "general": {
    "headerTitle": "Tytuł z {{data.variable}}",
    "headerDescription": "Opis emaila",
    "labels": {
      "field1": "Etykieta pola 1",
      "field2": "Etykieta pola 2"
    },
    "footer": "Stopka emaila"
  }
}
```

**translations/en.json**:
```json
{
  "general": {
    "headerTitle": "Title with {{data.variable}}",
    "headerDescription": "Email description",
    "labels": {
      "field1": "Field 1 label",
      "field2": "Field 2 label"
    },
    "footer": "Email footer"
  }
}
```

**translations/index.ts**:
```typescript
import pl from "./pl.json";
import en from "./en.json";

export { pl, en };

export const translations: Record<any, any> = {
  pl: pl,
  en: en,
};
```

### 2. Create Template Configuration

**config.ts** - This file exports both blocks and translations:

#### For Email Templates

```typescript
import pl from "./translations/pl.json";
import en from "./translations/en.json";

export { pl, en };

export const translations: Record<any, any> = {
  pl: pl,
  en: en,
};

/**
 * Your template blocks
 * 
 * Blocks are automatically interpolated with data and translations
 */
export const templateBlocks = [
  {
    type: "section",
    id: "section-1",
    props: {
      blocks: [
        {
          type: "heading",
          id: "heading-1",
          props: {
            value: "{{translations.headerTitle}}"
          }
        },
        {
          type: "text",
          id: "text-1",
          props: {
            value: "{{translations.headerDescription}}"
          }
        }
      ]
    }
  },
  {
    type: "separator",
    id: "separator-1"
  },
  {
    type: "section",
    id: "section-2",
    props: {
      blocks: [
        {
          type: "row",
          id: "row-1",
          props: {
            label: "{{translations.labels.field1}}",
            value: "{{data.field1}}"
          }
        },
        {
          type: "separator",
          id: "separator-2"
        },
        {
          type: "row",
          id: "row-2",
          props: {
            label: "{{translations.labels.field2}}",
            value: "{{data.field2}}"
          }
        }
      ]
    }
  },
  {
    type: "separator",
    id: "separator-3"
  },
  {
    type: "section",
    id: "section-3",
    props: {
      blocks: [
        {
          type: "text",
          id: "text-2",
          props: {
            value: "{{translations.footer}}"
          }
        }
      ]
    }
  }
];
```

#### For Slack Templates

```typescript
import pl from "./translations/pl.json";
import en from "./translations/en.json";

export { pl, en };

export const translations: Record<any, any> = {
  pl: pl,
  en: en,
};

/**
 * Your template blocks
 * 
 * Uses Slack Block Kit format
 * All text and url properties are automatically interpolated
 */
export const templateBlocks = [
  {
    type: "header",
    text: {
      type: "plain_text",
      text: "{{translations.headerTitle}}"
    }
  },
  {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "{{translations.headerDescription}}"
    }
  },
  {
    type: "section",
    fields: [
      {
        type: "mrkdwn",
        text: "*{{translations.labels.field1}}*\n{{data.field1}}"
      },
      {
        type: "mrkdwn",
        text: "*{{translations.labels.field2}}*\n{{data.field2}}"
      }
    ]
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "{{translations.actions.viewDetails}}"
        },
        url: "https://example.com/{{data.id}}",
        style: "primary"
      }
    ]
  }
];
```

### 3. Register Template

Add your template to the appropriate service file:

#### For Email Templates

**src/templates/emails/email-template-service.ts**:

```typescript
import {
  templateBlocks as YourTemplateBlocks,
  translations as yourTemplateTranslations,
} from "./your-template-name"

// In initializeDefaultTemplates():
this.registerTemplate(TEMPLATES_NAMES.YOUR_TEMPLATE, {
  ...this.baseTemplateConfig,
  getConfig: (): any => {
    return {
      blocks: YourTemplateBlocks,
      translations: yourTemplateTranslations,
    }
  },
})
```

#### For Slack Templates

**src/templates/slack/slack-template-service.ts**:

```typescript
import {
  templateBlocks as YourTemplateBlocks,
  translations as yourTemplateTranslations,
} from "./your-template-name"

// In initializeDefaultTemplates():
this.registerTemplate(TEMPLATES_NAMES.YOUR_TEMPLATE, {
  ...this.baseTemplateConfig,
  getConfig: (): any => {
    return {
      blocks: YourTemplateBlocks,
      translations: yourTemplateTranslations,
    }
  },
})
```

### 4. Add Template Name Constant

Add your template name to the constants:

**For Email**: `src/templates/emails/types.ts`
**For Slack**: `src/templates/slack/types.ts`

```typescript
export const TEMPLATES_NAMES = {
  // ... existing templates
  YOUR_TEMPLATE: "your-template-name",
} as const;
```

## Using Your Template

Once registered, you can use your template:

### Email Template

```typescript
import { emailService, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"

const { html, text, subject } = await emailService.render({
  templateName: TEMPLATES_NAMES.YOUR_TEMPLATE,
  data: {
    variable: "value",
    field1: "Value 1",
    field2: "Value 2"
  },
  options: { locale: "pl" }
})
```

### Slack Template

```typescript
import { slackService, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification-emails/templates/slack"

const { blocks } = await slackService.render({
  templateName: TEMPLATES_NAMES.YOUR_TEMPLATE,
  data: {
    variable: "value",
    field1: "Value 1",
    field2: "Value 2",
    id: "123"
  },
  options: { locale: "en" }
})
```

## Advanced: Using Repeater Blocks (Email)

For dynamic lists in email templates, use the `repeater` block:

```typescript
{
  type: "repeater",
  id: "repeater-1",
  props: {
    arrayPath: "items",
    itemBlocks: [
      {
        type: "product-item",
        props: {
          label: "{{translations.labels.product}}",
          thumbnail: "{{data.items.thumbnail}}",
          value: "{{data.items.title}} - {{data.items.quantity}}x"
        }
      }
    ]
  }
}
```

**Note**: Inside `itemBlocks`, `{{data.*}}` variables are resolved relative to the current array item. The `arrayPath` is automatically prepended.

## Advanced: Using Fields in Slack Sections

For dynamic fields in Slack sections, use `fieldsPath` and `fieldTemplate`:

```typescript
{
  type: "section",
  fieldsPath: "inventory_level.stock_locations",
  fieldTemplate: {
    type: "plain_text",
    text: "{{data.inventory_level.stock_locations.name}}"
  }
}
```

The system automatically creates a `fields` array from the array at `fieldsPath`.

## Variable Interpolation

### Data Variables

Access data using `{{data.*}}` syntax:

```typescript
{
  type: "text",
  props: {
    value: "Order {{data.order.id}}"
  }
}
```

### Translation Variables

Access translations using `{{translations.*}}` syntax:

```typescript
{
  type: "heading",
  props: {
    value: "{{translations.headerTitle}}"
  }
}
```

### Nested Access

Both support nested property access:

```typescript
{
  type: "row",
  props: {
    label: "{{translations.labels.orderTotal}}",
    value: "{{data.order.transformed.summary.total}}"
  }
}
```

### In Translations

Translations can also contain data variables:

```json
{
  "general": {
    "headerTitle": "Order #{{data.order.id}}"
  }
}
```

The system automatically interpolates `{{data.*}}` variables inside translation values.

## Best Practices

1. **Use meaningful IDs**: Always provide unique `id` values for blocks
2. **Group with sections**: Use `section` blocks to group related content
3. **Use translations**: Always use `{{translations.*}}` for user-facing text
4. **Test both locales**: Ensure translations work for all supported locales
5. **Validate data structure**: Document expected data structure for your template
6. **Follow existing patterns**: Look at existing templates for reference
7. **Use appropriate blocks**: Choose the right block type for your content
8. **Test interpolation**: Verify that all variables are correctly interpolated
9. **Keep blocks simple**: Don't over-nest blocks unnecessarily
10. **Document your template**: Add comments explaining the template structure

## Template Structure Details

### Email Block Types

- `section` - Container for grouping blocks
- `heading` - Heading text
- `text` - Plain text content
- `row` - Label-value pair
- `product-item` - Product display with thumbnail
- `repeater` - Repeat blocks for array items
- `separator` - Horizontal separator line

See [Blocks Documentation](../blocks.md) for detailed block specifications.

### Slack Block Types

- `header` - Header block
- `section` - Section block with text or fields
- `actions` - Action buttons
- All other [Slack Block Kit](https://api.slack.com/block-kit) block types

See [Blocks Documentation](../blocks.md) and [Slack Block Kit Documentation](https://api.slack.com/block-kit) for details.

## Runtime Template Registration

You can also register templates at runtime without modifying the service files:

```typescript
import { emailService } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"

emailService.registerTemplate("runtime-template", {
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
```

## See Also

- [Blocks Documentation](../blocks.md) - Understanding the block system
- [Templates Documentation](../templates.md) - Using templates
- [Translations Documentation](../translations.md) - Translation system details
- [Slack Block Kit Documentation](https://api.slack.com/block-kit) - Official Slack Block Kit reference
- [React Email Documentation](https://react.email/docs) - React Email components
