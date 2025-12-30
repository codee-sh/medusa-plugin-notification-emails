# Blocks System Documentation

The plugin uses a block-based template system that allows templates to be defined as arrays of blocks. This architecture enables flexibility, reusability, and prepares the system for future database storage and visual template builders.

## Overview

Templates are defined as arrays of blocks.

Blocks support automatic variable interpolation using `{{data.*}}` and `{{translations.*}}` syntax.

## Email Blocks

Email templates use a custom block system that renders to React Email components. Available block types:

### Section Block

Container block that groups other blocks together.

```typescript
{
  type: "section",
  id: "section-1",
  props: {
    blocks: [
      // Nested blocks
    ]
  }
}
```

### Heading Block

Renders a heading text.

```typescript
{
  type: "heading",
  id: "heading-1",
  props: {
    value: "{{translations.headerTitle}}"
  }
}
```

### Text Block

Renders plain text content.

```typescript
{
  type: "text",
  id: "text-1",
  props: {
    value: "{{translations.headerDescription}}"
  }
}
```

### Row Block

Renders a label-value pair in a row layout.

```typescript
{
  type: "row",
  id: "row-1",
  props: {
    label: "{{translations.labels.orderNumber}}",
    value: "{{data.order.transformed.order_number}}"
  }
}
```

### Product Item Block

Renders a product item with thumbnail, title, and details.

```typescript
{
  type: "product-item",
  id: "product-item-1",
  props: {
    label: "{{translations.labels.product}}",
    thumbnail: "{{data.order.transformed.items.thumbnail}}",
    value: "{{data.order.transformed.items.title}} - {{data.order.transformed.items.quantity}}x {{data.order.transformed.items.price}}"
  }
}
```

### Repeater Block

Repeats a set of blocks for each item in an array.

```typescript
{
  type: "repeater",
  id: "repeater-1",
  props: {
    arrayPath: "order.transformed.items",
    itemBlocks: [
      {
        type: "product-item",
        props: {
          label: "{{translations.labels.product}}",
          thumbnail: "{{data.order.transformed.items.thumbnail}}",
          value: "{{data.order.transformed.items.title}}"
        }
      }
    ]
  }
}
```

**Properties**:
- `arrayPath` - Dot-notation path to the array in the data object (e.g., `"order.transformed.items"`)
- `itemBlocks` - Array of blocks to repeat for each item in the array

**Note**: Inside `itemBlocks`, `{{data.*}}` variables are resolved relative to the current array item. The `arrayPath` is automatically prepended to data variable paths.

### Separator Block

Renders a horizontal separator line.

```typescript
{
  type: "separator",
  id: "separator-1"
}
```

### Variable Interpolation in Email Blocks

All string properties in block `props` are automatically interpolated. The interpolation uses `multiInterpolate` function which processes both `{{data.*}}` and `{{translations.*}}` variables.

**How it works for Email**:
- All string values in `props` are processed
- Nested blocks are processed recursively
- Variables are resolved using the same `multiInterpolate` function as other channels

## Slack Blocks

Slack templates use [Slack Block Kit](https://api.slack.com/block-kit) format. The system automatically interpolates all `text` and `url` properties recursively throughout the block structure.

### Header Block

```typescript
{
  type: "header",
  text: {
    type: "plain_text",
    text: "{{translations.header.title}}"
  }
}
```

### Section Block

```typescript
{
  type: "section",
  text: {
    type: "mrkdwn",
    text: "{{translations.section.text}}"
  }
}
```

### Section with Fields

You can create dynamic fields using `fieldsPath` and `fieldTemplate`:

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

**Properties**:
- `fieldsPath` - Dot-notation path to an array in the data object
- `fieldTemplate` - Template object for each field (will be interpolated for each array item)

The system automatically creates a `fields` array from the array at `fieldsPath`, using `fieldTemplate` as a template for each item.

### Actions Block

```typescript
{
  type: "actions",
  elements: [
    {
      type: "button",
      text: {
        type: "plain_text",
        text: "{{translations.actions.openInPanel}}"
      },
      url: "https://example.com/app/inventory/{{data.inventory_level.inventory_item.id}}",
      style: "primary"
    }
  ]
}
```

### Variable Interpolation in Slack Blocks

All `text` and `url` properties in Slack blocks are automatically interpolated recursively throughout the entire block structure. The interpolation uses `multiInterpolate` function which processes both `{{data.*}}` and `{{translations.*}}` variables.

**How it works for Slack**:
- Only `text` and `url` properties are processed (not all properties)
- The system recursively traverses the entire block tree
- Variables are resolved using the same `multiInterpolate` function as other channels

## Block Structure Example

### Email Template Example

```typescript
export const templateBlocks = [
  {
    type: "section",
    id: "section-1",
    props: {
      blocks: [
        {
          type: "heading",
          props: {
            value: "{{translations.headerTitle}}"
          }
        },
        {
          type: "text",
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
          props: {
            label: "{{translations.labels.orderNumber}}",
            value: "{{data.order.transformed.order_number}}"
          }
        }
      ]
    }
  }
]
```

### Slack Template Example

```typescript
export const templateBlocks = [
  {
    type: "header",
    text: {
      type: "plain_text",
      text: "{{translations.header.title}}"
    }
  },
  {
    type: "section",
    fieldsPath: "inventory_level.stock_locations",
    fieldTemplate: {
      type: "plain_text",
      text: "{{data.inventory_level.stock_locations.name}}"
    }
  },
  {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "{{translations.actions.openInPanel}}"
        },
        url: "/app/inventory/{{data.inventory_level.inventory_item.id}}",
        style: "primary"
      }
    ]
  }
]
```

## Variable Interpolation in Blocks

All blocks support automatic variable interpolation using `{{data.*}}` and `{{translations.*}}` syntax. The system uses the `multiInterpolate` function which processes variables recursively for both Email and Slack channels.

### Data Variables

Access data from the template data object using `{{data.*}}` prefix:

```typescript
// Example in Email block
{
  type: "text",
  props: {
    value: "Order {{data.order.id}}"
  }
}

// Example in Slack block
{
  type: "section",
  text: {
    type: "mrkdwn",
    text: "Order {{data.order.id}}"
  }
}
```

### Translation Variables

Access translations using `{{translations.*}}` prefix:

```typescript
// Example in Email block
{
  type: "heading",
  props: {
    value: "{{translations.headerTitle}}"
  }
}

// Example in Slack block
{
  type: "header",
  text: {
    type: "plain_text",
    text: "{{translations.headerTitle}}"
  }
}
```

### Nested Access

Both `{{data.*}}` and `{{translations.*}}` support nested property access using dot notation:

```typescript
// Access nested data
{{data.order.transformed.summary.total}}

// Access nested translations
{{translations.labels.orderTotal}}
```

### Channel-Specific Processing

While the interpolation function (`multiInterpolate`) is the same for both channels, the processing method differs:

- **Email blocks**: All string properties in `props` are interpolated
- **Slack blocks**: Only `text` and `url` properties are recursively interpolated throughout the block tree

For channel-specific details, see the "Variable Interpolation" sections within [Email Blocks](#email-blocks) and [Slack Blocks](#slack-blocks) sections above.

## Custom Blocks

You can override template blocks by providing custom blocks in the render options:

```typescript
const { html, text, subject } = await emailService.render({
  templateName: TEMPLATES_NAMES.ORDER_PLACED,
  data: templateData,
  options: {
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

When custom blocks are provided, they completely replace the template's default blocks. Variables in custom blocks are still automatically interpolated.

## Best Practices

1. **Use IDs**: Always provide unique `id` values for blocks when possible
2. **Use Translations**: Always use `{{translations.*}}` for user-facing text
3. **Use Data Variables**: Use `{{data.*}}` for dynamic content from your data
4. **Test Interpolation**: Verify that all variables are correctly interpolated

## Future: Database Storage

The block-based system is designed to support future database storage. Templates can be stored as JSON in a database and loaded dynamically, enabling:

- Visual template builders
- User-customizable templates
- A/B testing of templates
- Template versioning

## See Also

- [Templates Documentation](./templates.md) - Using templates with blocks
- [Translations Documentation](./translations.md) - Variable interpolation details
- [Creating Custom Templates](./contributing/creating-templates.md) - Creating templates with blocks
- [Slack Block Kit Documentation](https://api.slack.com/block-kit) - Official Slack Block Kit reference

