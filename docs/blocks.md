# Blocks Documentation

This document is split into three parts:

1. `db` templates (builder storage + admin fields)
2. `system` and `external` templates (code authoring)
3. final block catalog used by all template types

## 1) `db` templates - how blocks work in builder

In builder mode, blocks are persisted in a universal DB model (channel-agnostic):

- block identity and tree: `type`, `parent_id`, `position`
- block payload: `metadata`
- template language: `locale` on template record

Builder endpoints:

- `GET /api/admin/mpn/templates/:id/blocks` - load DB block tree
- `POST /api/admin/mpn/templates/:id/blocks` - save DB block tree

### Where do we define what block saves in DB and what is shown in Admin?

Block field definitions are configured in service block schemas:

- `src/modules/mpn-builder/services-local/email-template-service.ts`
- `src/modules/mpn-builder/services-local/slack-template-service.ts`

Those schemas define:

- block type (`heading`, `row`, `repeater`, etc.)
- field keys (`value`, `label`, `arrayPath`, etc.)
- field input types in Admin (`text`, `textarea`, ...)

Admin form fields map directly to `metadata` keys in DB.

### DB -> final rendering flow

For `db` templates:

- email flow transforms DB `metadata` into final email block `props`
- slack flow transforms DB `metadata` into final Slack Block Kit structure
- after transformation, rendering uses the same final block contract as `system`/`external`

This means:

- `db` differs by source/storage
- final rendering behavior is shared

### `db` practical note about translations

For `db` blocks, prefer:

- `{{data.*}}` placeholders
- explicit user text in `metadata`

`{{translations.*}}` is mainly for `system`/`external` templates where translation dictionaries are defined in code.

## 2) `system` and `external` templates - authoring in code

For `system` and `external`, you author final blocks directly in code (`blocks` + `translations`).

Important distinction:

- `section` is a valid final block in code templates (`system`/`external`)
- `section` is not exposed as a DB builder block type
- in DB builder, use `group` as container; it is later transformed to final channel structure

Example locations:

- system templates: plugin template config files
- external templates: your package/file imported via `options.extend.services`

### Final email example

```typescript
export const templateBlocks = [
  {
    type: "section",
    props: {
      blocks: [
        {
          type: "heading",
          props: {
            value: "{{translations.headerTitle}}"
          }
        },
        {
          type: "row",
          props: {
            label: "{{translations.labels.orderNumber}}",
            value: "{{data.order.transformed.order_number}}"
          }
        }
      ]
    }
  },
  {
    type: "repeater",
    props: {
      arrayPath: "order.transformed.items",
      itemBlocks: [
        {
          type: "product-item",
          props: {
            label: "{{translations.labels.product}}",
            thumbnail: "{{data.order.transformed.items.thumbnail}}",
            value: "{{data.order.transformed.items.title}} - {{data.order.transformed.items.quantity}}x"
          }
        }
      ]
    }
  }
]
```

### Final slack example

```typescript
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
    fieldsPath: "inventory_level.stock_locations",
    fieldTemplate: {
      type: "plain_text",
      text: "{{data.inventory_level.stock_locations.name}}: {{data.inventory_level.stock_locations.quantity}}"
    }
  },
  {
    type: "divider"
  }
]
```

## 3) Final block catalog (shared target model)

This is the final block model used during rendering, regardless of source (`db`, `system`, `external`).

### Email final blocks

- `section` (code templates)
  - note: used directly in `system`/`external` configs
  - in `db` flow, container behavior usually comes from `group` transformed to `props.blocks`
- `section`
  - purpose: container
  - required data: `props.blocks`
- `heading`
  - purpose: title
  - required data: `props.value`
- `text`
  - purpose: paragraph/content
  - required data: `props.value`
- `row`
  - purpose: label/value pair
  - required data: `props.label`, `props.value`
- `separator`
  - purpose: visual divider
  - required data: none
- `group`
  - purpose: nested grouping
  - required data: `props.blocks`
- `repeater`
  - purpose: repeat nested blocks for array
  - required data: `props.arrayPath`, `props.itemBlocks`
- `product-item` (email)
  - purpose: product row
  - required data: `props.label`, `props.thumbnail`, `props.value`

### Slack final blocks (Block Kit)

- `header`
  - purpose: header text
  - required data: `text.type`, `text.text`
- `section` with `text`
  - purpose: body text
  - required data: `text.type`, `text.text`
- `section` with `fields`
  - purpose: compact list/key-value display
  - required data: `fields[]`
- `section` with `fieldsPath` + `fieldTemplate` (plugin helper)
  - purpose: dynamically generate `fields` from array data
  - required data: `fieldsPath`, `fieldTemplate`
- `actions`
  - purpose: buttons/actions
  - required data: `elements[]`
- `divider`
  - purpose: visual separation
  - required data: none

## Best Practices

1. Use `db` when template should be editable in Admin.
2. Use `system`/`external` when template should be managed in code with translation dictionaries.
3. Keep block payload minimal and block-specific.
4. In `db`, configure admin-editable keys via service block field definitions.
5. In `db`, prefer `group` for nesting; in `system`/`external`, use `section` directly where needed.
6. Design final blocks first, then map DB metadata to those final fields.

## See Also

- [Templates Documentation](./templates.md) - Template types and workflows
- [Translations Documentation](./translations.md) - Interpolation and locale behavior
- [Creating Custom Templates](./contributing/creating-templates.md) - Contributor guide
- [Slack Block Kit Documentation](https://api.slack.com/block-kit) - Slack format reference

