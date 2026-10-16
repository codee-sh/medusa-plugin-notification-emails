---
"@codee-sh/medusa-plugin-notification-emails": minor
---

Make the plugin safe to install for rendering only.

**Behaviour changes - read before upgrading**

- The `order.placed` and `order.completed` subscribers are opt-in and no longer email customers by
  default. Migration: add `subscribers` to the plugin options to keep order emails:
  `subscribers: { "order.placed": { enabled: true, locale: "pl" }, "order.completed": { enabled: true, locale: "pl" } }`.
  The locale comes from that option; 1.0.x used `pl`, the default is now `en`.
- Values from `data` are HTML-escaped in the props a block renders as HTML (`text`, `row` and
  `product-item` values). Translation text may still contain HTML.
- A `{{data.*}}` placeholder with no value renders as an empty string, and a `heading`, `text` or
  `row` whose value is empty is not rendered.
- `@react-email/components` and `@react-email/render` are pinned to 0.3.3 and 1.1.4, the versions
  Medusa Cloud supports. `react`, `react-dom` and `@medusajs/ui` are peer dependencies;
  `react-email` and `@react-email/preview-server` are development dependencies.
- The translator falls back to `en` instead of `pl` when a locale has no translations.
- The "Builder - Lexical" admin page is removed, with its `lexical` and `@lexical/*` dependencies.

**Fixes**

- A repeater renders every block of `itemBlocks` for every item, in order, and blocks nested inside
  an item block read the item. An empty or missing array renders `emptyBlocks` or nothing, never
  raw placeholders.
- Interpolation scans the text once: `$&`, `$1` and `{{...}}` inside a value are inserted literally.
- `order.completed` read the customer email from the wrong object.
- The admin render route read the plugin options under a wrong plugin name.
- Render data is no longer written to the console.

**Features**

- `@codee-sh/medusa-plugin-notification-emails/workflows` exports `emailServiceWorkflow` and
  `slackServiceWorkflow` with typed input and output, and the package ships `.d.ts` types.
- `emailServiceWorkflow` accepts `options.subject`; `options` is optional.
- An external template `path` is loaded with `require`, so a path without extension or a directory
  resolves. A load failure is logged as an error naming the template.
