# Translations Documentation

The plugin includes a lightweight internationalization (i18n) system with support for multiple locales and custom translation overrides. The system uses simple utility functions (`createTranslator`, `t`, `multiInterpolate`, `mergeTranslations`) without external dependencies. Translations use string interpolation with `{{variable}}` syntax for dynamic content.

## Supported Locales

- **English (`en`)**: Default locale
- **Polish (`pl`)**: Secondary locale

## Translation Structure

Translations are organized by template and locale. Each template has its own translation JSON files:

```
src/templates/emails/
  order-placed/
    translations/
      pl.json    # Polish translations
      en.json    # English translations
      index.ts   # Translation exports
```

### Translation File Format

Translation files are JSON objects with a `general` wrapper that gets automatically flattened:

```json
{
  "general": {
    "headerTitle": "#{{orderNumber}} - Order placed",
    "headerDescription": "Your order has been received...",
    "labels": {
      "orderNumber": "Order number",
      "orderDate": "Order date"
    },
    "footer": "If you have any questions..."
  }
}
```

The `general` wrapper is automatically flattened, so you can access translations directly using keys like `headerTitle` or `labels.orderNumber`.

## Using Translations

Translations are automatically applied when rendering templates:

```typescript
import { emailService, TEMPLATES_NAMES } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"

// Uses English translations
const { html, text, subject } = await emailService.render({
  templateName: TEMPLATES_NAMES.ORDER_PLACED,
  data: templateData,
  options: { locale: "en" }
})

// Uses English translations
const { html, text, subject } = await emailService.render({
  templateName: TEMPLATES_NAMES.ORDER_PLACED,
  data: templateData,
  options: { locale: "en" }
})
```

**Note**: The template service automatically merges template translations with custom translations (if provided) and applies the selected locale.

## Variable Interpolation System

The plugin uses a powerful two-prefix interpolation system that processes variables in blocks and translations:

### Data Variables (`{{data.*}}`)

Access data from the template data object using the `data.` prefix:

```typescript
// In template blocks:
{
  type: "text",
  props: {
    value: "Order {{data.order.id}}"
  }
}

// With data:
{
  order: { id: "123" }
}

// Result: "Order 123"
```

### Translation Variables (`{{translations.*}}`)

Access translations using the `translations.` prefix:

```typescript
// In template blocks:
{
  type: "heading",
  props: {
    value: "{{translations.headerTitle}}"
  }
}

// Translation file (en.json):
{
  "general": {
    "headerTitle": "Order #{{data.order.id}}"
  }
}

// Result (with locale: "en"): "Order #123"
```

### Nested Access

Both prefixes support nested property access using dot notation:

```typescript
// Data:
{
  order: {
    transformed: {
      summary: {
        total: "100.00"
      }
    }
  }
}

// In blocks:
{
  type: "row",
  props: {
    label: "{{translations.labels.orderTotal}}",
    value: "{{data.order.transformed.summary.total}}"
  }
}
```

### Recursive Interpolation

The system processes variables recursively:

1. **First pass**: `{{translations.*}}` variables are resolved using the translator
2. **Second pass**: `{{data.*}}` variables are resolved from the data object
3. **Nested interpolation**: Translation values can contain `{{data.*}}` variables which are also interpolated

**Example**:

```json
{
  "general": {
    "headerTitle": "Order #{{data.order.id}} - {{data.order.status}}"
  }
}
```

```typescript
// Block:
{
  type: "heading",
  props: {
    value: "{{translations.headerTitle}}"
  }
}

// Data:
{
  order: {
    id: "123",
    status: "completed"
  }
}

// Process:
// 1. Resolve translation: "Order #{{data.order.id}} - {{data.order.status}}"
// 2. Interpolate data variables: "Order #123 - completed"
// Result: "Order #123 - completed"
```

## Custom Translations

You can override default translations in two ways. Custom translations use the same JSON structure as base translations.

### 1. Plugin Configuration

Override translations globally in `medusa-config.ts`:

```typescript
module.exports = defineConfig({
  plugins: [
    {
      resolve: "@codee-sh/medusa-plugin-notification-emails",
      options: {
        customTranslations: {
          "order-placed": {
            en: {
              headerTitle: "#{{orderNumber}} - Your order",
              labels: {
                orderNumber: "Order number",
                orderDate: "Order date"
              }
            }
          }
        }
      }
    }
  ]
})
```

### 2. Per-Template Override

Override translations when rendering a specific template:

```typescript
const { html, text, subject } = await emailService.render({
  templateName: TEMPLATES_NAMES.ORDER_PLACED,
  data: templateData,
  options: {
    locale: "en",
    translations: {
      headerTitle: "#{{data.order.id}} - Custom Title",
      labels: {
        orderNumber: "Custom Order Number Label"
      }
    }
  }
})
```

**Note**: The `translations` option accepts a flat object (without locale wrapper) that will be merged with the template's translations for the selected locale.

### How Custom Translations Work

- Custom translations are **deeply merged** with base translations
- You can override individual keys without replacing entire objects
- Nested objects (like `labels`) are merged, not replaced
- Interpolation variables (`{{variable}}`) work the same way in custom translations

## Translation System Architecture

The plugin uses a simple, lightweight translation system built with utility functions:

- **`createTranslator(locale, translations)`** - Creates a translator function for a specific locale
- **`t(locale, translations, key)`** - Simple translation function that retrieves a translation by key
- **`multiInterpolate(text, data, translator, config)`** - Interpolates `{{data.*}}` and `{{translations.*}}` variables in text
- **`mergeTranslations(baseTranslations, customTranslations)`** - Merges custom translations with base translations

The translator object has a `t(key, data?)` method that:
1. Retrieves the translation for the given key
2. Supports nested keys using dot notation (e.g., `labels.orderNumber`)
3. Automatically flattens the `general` wrapper from JSON files
4. Falls back to the key itself if translation is not found

**Example**:
```typescript
import { createTranslator } from "@codee-sh/medusa-plugin-notification-emails/utils"

const translator = createTranslator("en", {
  en: {
    general: {
      headerTitle: "Order #{{data.order.id}}",
      labels: {
        orderNumber: "Order number"
      }
    }
  }
})

// Simple key
translator.t('headerTitle', { order: { id: "123" } })
// Returns: "Order #123"

// Nested key
translator.t('labels.orderNumber')
// Returns: "Order number"
```

## Accessing Translations Programmatically

If you need to access translations programmatically (e.g., in custom code), you can use the translator from the template service:

```typescript
import { emailService } from "@codee-sh/medusa-plugin-notification-emails/templates/emails"

// Get template and prepare data
const { translator } = emailService.prepareData({
  templateName: TEMPLATES_NAMES.ORDER_PLACED,
  data: templateData,
  options: { locale: "en" }
})

// Use translator
const title = translator.t('headerTitle', templateData)
```

## Best Practices

1. **Use prefix syntax**: Prefer `{{data.*}}` and `{{translations.*}}` prefixes for clarity
2. **Use interpolation for dynamic content**: Use variable syntax instead of string concatenation
3. **Override per-template**: For one-off changes, override when calling `render()` or `renderSync()`
4. **Preserve structure**: When overriding nested objects, maintain the same JSON structure
5. **Test both locales**: Ensure custom translations work for all supported locales
6. **Use meaningful variable names**: Use clear variable names that match your data structure
7. **Keep translations in JSON**: Store translations as JSON files, not TypeScript files with functions
8. **Use translations for user-facing text**: Always use `{{translations.*}}` for text that users see
9. **Use data for dynamic values**: Use `{{data.*}}` for values that come from your data objects
10. **Test interpolation**: Verify that all variables are correctly interpolated in both locales

## Adding New Locales

To add support for a new locale:

1. Create translation JSON files for each template:
   ```
   order-placed/translations/de.json
   contact-form/translations/de.json
   ```

2. Follow the same JSON structure with `general` wrapper:
   ```json
   {
     "general": {
       "headerTitle": "Translation with {{variable}}",
       "labels": {
         "orderNumber": "Order Number"
       }
     }
   }
   ```

3. Export translations in `translations/index.ts`:
   ```typescript
   import de from "./de.json";
   export const translations = { de, pl, en };
   ```

4. The locale will be automatically available when you use it:
   ```typescript
   await emailService.render({
     templateName: TEMPLATES_NAMES.ORDER_PLACED,
     data: templateData,
     options: { locale: "de" }
   })
   ```

