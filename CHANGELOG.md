# @codee-sh/medusa-plugin-notification-emails

## 0.2.0

### Minor Changes

- 0c0b239: Create Abstract Template Service, EmailTemplateService and SlackTemplateService and remove old functions like renderTemplate
- 0c0b239: Add Slack templates with Kit Builder like emails

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
