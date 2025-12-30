# @codee-sh/medusa-plugin-notification-emails

## 0.2.1

### Patch Changes

- d63fe38: refactor: update Slack template service to omit unnecessary fields

## 0.2.0

### Minor Changes

- **Template Service Architecture Refactor**: New class-based template service architecture with `AbstractTemplateService` as the base class, and concrete implementations `EmailTemplateService` and `SlackTemplateService`. This provides a unified, extensible system for managing and rendering templates across different notification channels.

- **Slack Templates with Block Kit**: Added comprehensive Slack template support using Slack Block Kit format, similar to the existing email block system. Templates are now defined as arrays of blocks with type and props, enabling flexible content structure.

- **Custom i18n System**: Implemented a lightweight custom i18n utility system (`createTranslator`, `t`, `multiInterpolate`, `mergeTranslations`) that works without external dependencies like `i18next`. The system supports recursive interpolation of `{{data.*}}` and `{{translations.*}}` variables in templates.

- **Recursive Interpolation for Slack**: Implemented recursive interpolation mechanism that traverses nested Slack Block Kit structures and interpolates all `text` and `url` properties, regardless of nesting depth.

- **Documentation Updates**: Comprehensive documentation updates including:

  - New `blocks.md` documenting the block-based template system with separate sections for Email and Slack blocks
  - Updated `templates.md` with new service-based architecture
  - Updated `translations.md` documenting the custom i18n system
  - Updated `contributing/creating-templates.md` with new template creation guidelines
  - Added `CONTRIBUTING.md` with development guidelines and changeset workflow

- **Code Cleanup**: Removed deprecated and unused code:

  - Removed old `renderTemplate` and `renderTemplateSync` wrapper functions
  - Removed unused base-template for Slack
  - Removed `payment-captured` subscriber
  - Cleaned up unused imports and deprecated notification workflows

- **Template Configuration**: Each template now provides a `getConfig()` method that returns its specific blocks and translations, allowing for easy registration of new or custom templates.

- **Mock Data Updates**: Updated mock data for contact form and other templates to reflect the new template structure.

## 0.1.1

### Patch Changes

- e7955de: Remove unused import
- cb597d8: Data transformation system: Centralized transformers for converting raw API data
  (orders, products, etc.) into email-friendly format with formatted dates, amounts,
  and addresses
- cb597d8: Added ORDER_ATTRIBUTES, PRODUCT_ATTRIBUTES, and QUERY_FIELDS definitions for all entity types (order, product, variant, inventory, etc.)
- cb597d8: Moved order email templates to order/ subdirectory (placed, completed, updated) for better organization

## 0.1.0

### Minor Changes

- 80f4a9f: Add multi blocks feature
