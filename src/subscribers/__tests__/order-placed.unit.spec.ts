import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import orderPlacedEmailsHandler from "../order-placed"
import { getOrderByIdWorkflow } from "../../workflows/order/get-order-by-id"
import { emailServiceWorkflow } from "../../workflows/mpn-builder-services/email-service"

jest.mock("../../workflows/order/get-order-by-id", () => ({
  getOrderByIdWorkflow: jest.fn(),
}))

jest.mock(
  "../../workflows/mpn-builder-services/email-service",
  () => ({
    emailServiceWorkflow: jest.fn(),
  })
)

jest.mock("../../utils/transforms", () => ({
  transformContext: (_type: string, order: any) => ({
    order,
  }),
}))

const PLUGIN_NAME =
  "@codee-sh/medusa-plugin-notification-emails"

const orderRun = jest.fn()
const emailRun = jest.fn()
const createNotifications = jest.fn()

/**
 * Container with the plugin registered under the given options
 */
function createContainer(
  pluginOptions?: Record<string, any>
) {
  const services: Record<string, any> = {
    [ContainerRegistrationKeys.CONFIG_MODULE]: {
      plugins: [
        { resolve: PLUGIN_NAME, options: pluginOptions },
      ],
    },
    [Modules.NOTIFICATION]: { createNotifications },
  }

  return {
    resolve: (key: string) => services[key],
  } as any
}

const event = {
  name: "order.placed",
  data: { id: "order_1", trigger_type: "system" },
} as any

describe("order.placed subscriber", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getOrderByIdWorkflow as jest.Mock).mockReturnValue({
      run: orderRun,
    })
    ;(emailServiceWorkflow as jest.Mock).mockReturnValue({
      run: emailRun,
    })
    orderRun.mockResolvedValue({
      result: {
        customer: { email: "customer@example.com" },
      },
    })
    emailRun.mockResolvedValue({
      result: { html: "<p>x</p>", text: "x", subject: "S" },
    })
  })

  it("does nothing without the subscribers option", async () => {
    await orderPlacedEmailsHandler({
      event,
      container: createContainer(),
    } as any)

    expect(orderRun).not.toHaveBeenCalled()
    expect(createNotifications).not.toHaveBeenCalled()
  })

  it("does nothing when the subscriber is disabled", async () => {
    await orderPlacedEmailsHandler({
      event,
      container: createContainer({
        subscribers: { "order.placed": { enabled: false } },
      }),
    } as any)

    expect(createNotifications).not.toHaveBeenCalled()
  })

  it("sends one notification with the configured locale when enabled", async () => {
    await orderPlacedEmailsHandler({
      event,
      container: createContainer({
        subscribers: {
          "order.placed": { enabled: true, locale: "de" },
        },
      }),
    } as any)

    expect(emailRun).toHaveBeenCalledWith({
      input: expect.objectContaining({
        options: { locale: "de" },
      }),
    })
    expect(createNotifications).toHaveBeenCalledTimes(1)
    expect(createNotifications).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "customer@example.com",
        channel: "email",
      })
    )
  })
})
