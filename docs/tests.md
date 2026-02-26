This document explains how to run and create tests for this plugin.

## What You Can Do

- Run integration tests for workflows.
- Use a local Docker Postgres for tests.
- Add new test files that follow Medusa’s testing conventions.

## Prerequisites

- Node.js 20+
- Yarn 4
- Docker Desktop

## Local Test Database

Start the Docker Postgres used by integration tests:

```bash
docker compose -f docker-compose.test.yml up -d
```

The container binds to `localhost:5432`. If port `5432` is already in use,
stop the local Postgres process:

```bash
sudo lsof -nP | grep ":5432" | head -n 20
```

Then stop the process reported by the command:

```bash
sudo kill <PID>
```

## Environment Variables

Integration tests load `.env.test` if present, otherwise `.env`.
Make sure these variables exist for the test database:

```env
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

## Run Tests

Integration HTTP tests:

```bash
yarn test:integration:http
```

Integration module tests:

```bash
yarn test:integration:modules
```

Unit tests:

```bash
yarn test:unit
```

## Create Tests

Integration HTTP tests go in:

```text
integration-tests/http/*.spec.ts
```

Integration module tests go in:

```text
src/modules/*/__tests__/**/*.ts
```

Unit tests go in:

```text
src/**/__tests__/**/*.unit.spec.ts
```

## Example Workflow Test

```ts
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { slackServiceWorkflow } from "../../src/workflows/mpn-builder-services/slack-service"

medusaIntegrationTestRunner({
  moduleName: "notification-emails",
  medusaConfigFile: process.cwd(),
  testSuite: ({ getContainer }) => {
    describe("slackServiceWorkflow", () => {
      it("renders a system Slack template", async () => {
        const { result } = await slackServiceWorkflow(getContainer()).run({
          input: {
            template_id: "system_order-placed",
            data: {
              backendUrl: "http://localhost:9000",
              order: { id: "order_123" },
            },
            options: {
              locale: "en",
              theme: {},
              translations: {},
              backendUrl: "http://localhost:9000",
            },
          },
        })

        expect(Array.isArray(result.blocks)).toBe(true)
      })
    })
  },
})
```

## See Also

- [Configuration](./configuration.md)
- [Templates](./templates.md)
