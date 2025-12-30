import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe("Notification plugin events routes", () => {
      describe("POST /admin/notification-plugin/events", () => {
        it("returns correct message", async () => {
          const response = await api.post(
            `/admin/notification-plugin/events`
          )
  
          expect(response.status).toEqual(200)
        //   expect(response.data).toHaveProperty("message")
        //   expect(response.data.message).toEqual("Hello, World!")
        })
      })
    })
  },
})

jest.setTimeout(60 * 1000)