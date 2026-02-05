---
"@codee-sh/medusa-plugin-notification-emails": major
---

## Breaking Changes

### API Routes Changed
All API endpoints moved from `/api/admin/notification-plugin/` to `/api/admin/mpn/`. Update all API integrations.

**Changed endpoints:**
- `/api/admin/notification-plugin/events` → `/api/admin/mpn/events`
- `/api/admin/notification-plugin/notifications` → `/api/admin/mpn/notifications`
- `/api/admin/notification-plugin/render-template` → `/api/admin/mpn/render-template`

**New endpoints:**
- `/api/admin/mpn/available-templates`
- `/api/admin/mpn/templates`
- `/api/admin/mpn/templates/[id]/blocks`
- `/api/admin/mpn/templates/types`
- `/api/admin/mpn/templates/types/[type]/services`
- `/api/admin/mpn/templates/types/[type]/services/[service]/templates`

### Admin UI Routes Changed
Admin UI routes changed from `/notifications-emails/` to `/mpn/notifications/`. Update all Admin UI links/bookmarks.

**Changed routes:**
- `/notifications-emails/list` → `/mpn/notifications/list`
- `/notifications-emails/render` → `/mpn/notifications/render`

**New routes:**
- `/mpn/templates` - templates list
- `/mpn/templates/[id]/blocks` - template blocks editor

### Module Restructure
Modules moved from `templates/` to `modules/mpn-builder/`. Update all direct imports from `templates/`.

**Removed locations:**
- `src/templates/emails/email-template-service.ts`
- `src/templates/slack/slack-template-service.ts`
- `src/templates/emails/types.ts`
- `src/templates/slack/types.ts`

**New locations:**
- `src/modules/mpn-builder/services-local/email-template-service.ts`
- `src/modules/mpn-builder/services-local/slack-template-service.ts`
- `src/modules/mpn-builder/types/`

### Old Workflows Removed
Removed old workflows (`email-service`, `mpn-templates/*`). Migrate to new `mpn-builder/*` workflows.

### Email and Slack Service Import Changed
Changed import and execution method for `emailService` and `slackService`:

**Before:**
```typescript
import { emailService } from "../templates/emails"
await emailService.render(...)
```

**After:**
```typescript
import { emailServiceWorkflow } from "../workflows/mpn-builder-services/email-service"
await emailServiceWorkflow(container).run({...})
```

## New Features

### MPN Builder Module
Added complete `mpn-builder` module with template management (services, models, 3 migrations).

### UI Builder for Templates
Added full UI builder with drag & drop, inline editing, and template preview. Supports multiple block types (heading, text, row, separator, group, repeater, product-item).

### Slack Block Kit Support
Added full Slack Block Kit format support with block transformation and data interpolation. Supports all Slack block types (header, section, divider, etc.) and nested structures.

### External Templates Support
Added support for external templates with type filtering. Configure via `medusa-config.ts`:

```typescript
{
  resolve: "@codee-sh/medusa-plugin-notification-emails",
  options: {
    extend: {
      services: [
        {
          id: "slack", // Service ID (e.g., "slack", "email")
          templates: [
            {
              name: "external_template-name",
              path: path.resolve(require.resolve("@package/templates/slack/template"))
            }
          ]
        }
      ]
    }
  }
}
```

**Template Types:**
- `system` - Built-in system templates (default)
- `db` - Templates stored in database (created via UI or API)
- `external` - External templates registered programmatically or via configuration

### New Block Types
Added support for new block types (group, repeater, product-item) with recursive rendering, data interpolation, and nested structures.

### New Workflows and Steps
Added 10+ workflows for template management:
- `create-template` - create template
- `edit-template` - edit template
- `delete-template` - delete template
- `edit-template-blocks` - edit template blocks
- `get-template` - get single template
- `get-blocks-by-template-id` - get template blocks
- `get-templates-services` - get template services
- `get-templates-types` - get template types
- `get-templates-by-type-service` - get templates by type
- `get-services-types-templates` - get templates with filtering

All workflows include full JSDoc documentation.

### Helper Components
Added helper components (ManagerFields, TwoColumnPage, form fields: TextField, TextAreaField, SelectField, NumberField, CheckboxField).

### Store and Region Workflows
Added workflows for retrieving Store and Region data (`get-store-by-id`, `get-region-by-id`) for template preview context.

### API Middleware
Added middleware for API routing (error handling, request validation).

## Improvements

- Code refactoring: standardized naming (`settings` → `options`), renamed `renderTemplate` → `renderAction`, removed unused methods, consolidated similar methods
- Template ID handling fixes: unified template ID handling (removed `system_` prefix in UI, kebab-case format, fixed recognition logic)
- Removed unused files (old workflows, types, interfaces, console.logs, placeholder text)
- Fixed block data structure (added `parent_id` support, fixed `children` structure, added `arrayPath` for repeaters)
- Added JSDoc documentation for all workflows and steps
- UI improvements: button sizes, field descriptions, two-column layout, better error messages
- Improved data handling: added `region` to order queries, improved template filtering, fixed Slack Block Kit transformation
- Added new UI dependencies (`@dnd-kit/core`, `@lexical/*`, `@react-email/*`, `react-email`)
