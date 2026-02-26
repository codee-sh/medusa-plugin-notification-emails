import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { slackServiceWorkflow } from "../../src/workflows/mpn-builder-services/slack-service"

medusaIntegrationTestRunner({
  moduleName: "notification-emails",
  medusaConfigFile: process.cwd(),
  testSuite: ({ getContainer }) => {
    describe("slackServiceWorkflow", () => {
      jest.setTimeout(60 * 1000)

      it("renders a system Slack template", async () => {
        const { result } = await slackServiceWorkflow(
          getContainer()
        ).run({
          input: {
            template_id: "system_order-placed",
            data: {
              backendUrl: "http://localhost:9000",
              order: {
                id: "order_123",
                name: "Test Order",
                display_id: "123",
              },
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
        expect(result.blocks.length).toBeGreaterThan(0)
      })
    })
  },
})
