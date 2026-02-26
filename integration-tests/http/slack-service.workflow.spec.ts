import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { slackServiceWorkflow } from "../../src/workflows/mpn-builder-services/slack-service"

type SlackTemplateCase = {
  name: string
  templateId: string
  data: Record<string, any>
}

const backendUrl = "http://localhost:9000"

const cases: SlackTemplateCase[] = [
  {
    name: "inventory level",
    templateId: "system_inventory-level",
    data: {
      backendUrl,
      inventory_level: {
        inventory_item: { id: "ii_123" },
        stock_locations: [{ name: "Main" }],
      },
    },
  },
  {
    name: "product",
    templateId: "system_product",
    data: {
      backendUrl,
      product: { id: "prod_123" },
    },
  },
  {
    name: "product variant",
    templateId: "system_product-variant",
    data: {
      backendUrl,
      product_variant: {
        id: "variant_123",
        product: { id: "prod_123" },
      },
    },
  },
  {
    name: "order placed",
    templateId: "system_order-placed",
    data: {
      backendUrl,
      order: { id: "order_123" },
    },
  },
  {
    name: "order completed",
    templateId: "system_order-completed",
    data: {
      backendUrl,
      order: { id: "order_123" },
    },
  },
  {
    name: "order updated",
    templateId: "system_order-updated",
    data: {
      backendUrl,
      order: { id: "order_123" },
    },
  },
  {
    name: "order canceled",
    templateId: "system_order-canceled",
    data: {
      backendUrl,
      order: { id: "order_123" },
    },
  },
  {
    name: "order archived",
    templateId: "system_order-archived",
    data: {
      backendUrl,
      order: { id: "order_123" },
    },
  },
]

medusaIntegrationTestRunner({
  moduleName: "notification-emails",
  medusaConfigFile: process.cwd(),
  testSuite: ({ getContainer }) => {
    describe("slackServiceWorkflow templates", () => {
      jest.setTimeout(60 * 1000)

      test.each(cases)(
        "renders $name",
        async ({ templateId, data }) => {
          const { result } = await slackServiceWorkflow(
            getContainer()
          ).run({
            input: {
              template_id: templateId,
              data,
              options: {
                locale: "en",
                theme: {},
                translations: {},
                backendUrl,
              },
            },
          })

          expect(Array.isArray(result.blocks)).toBe(true)
          expect(result.blocks.length).toBeGreaterThan(0)
          result.blocks.forEach((block: any) => {
            expect(block.type).toBeTruthy()
          })
        }
      )
    })
  },
})
