# Inventory Level Template Tests

This directory contains integration tests for the Slack inventory-level template.

## Running Tests

According to [Medusa Testing Tools documentation](https://docs.medusajs.com/learn/debugging-and-testing/testing-tools):

```bash
# Run unit tests (default)
yarn test:unit
# or
yarn test

# Run unit tests in watch mode
yarn test:watch

# Run unit tests with coverage
yarn test:coverage

# Run integration tests for modules
yarn test:integration:modules

# Run integration tests for HTTP routes
yarn test:integration:http
```

## Test Coverage

The tests cover:

- ✅ Template registration
- ✅ Template rendering with basic data
- ✅ Variable interpolation (translations and data)
- ✅ Dynamic fields generation from `fieldsPath`
- ✅ Helper properties removal (`fieldsPath`, `fieldTemplate`)
- ✅ Multi-locale support (en, pl)
- ✅ Custom translations
- ✅ Error handling

## Test Data

The tests use mock inventory level data with:
- Inventory item with title
- Stock locations array
- Quantities (stocked, reserved, incoming, available)

