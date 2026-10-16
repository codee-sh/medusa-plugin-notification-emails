import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const logStep = createStep(
  {
    name: "log-step",
  },
  function (input: any, { container }) {
    container
      .resolve(ContainerRegistrationKeys.LOGGER)
      .debug(`log-step: ${JSON.stringify(input, null, 2)}`)

    return new StepResponse({
      status: "success",
      message: "Requested",
      input: input,
    })
  }
)

export { logStep }
