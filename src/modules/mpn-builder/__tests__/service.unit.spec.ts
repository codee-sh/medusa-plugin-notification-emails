import path from "path"
import MpnBuilderService from "../service"

const FIXTURE_PATH = path.join(
  __dirname,
  "fixtures/external-template"
)

function createLogger() {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }
}

/**
 * Builds the service with one external email template and waits for the asynchronous
 * registration that the constructor starts
 */
async function createService(
  template: Record<string, any>
) {
  const logger = createLogger()
  const service = new MpnBuilderService({ logger } as any, {
    extend: {
      services: [
        {
          id: "email",
          templates: [template as any],
        },
      ],
    },
  })

  await new Promise((resolve) => setTimeout(resolve, 50))

  const emailService =
    service.getTemplateService("email")!.templateService

  return { logger, emailService }
}

describe("MpnBuilderService external templates", () => {
  it("loads a template from a directory path without extension", async () => {
    const { logger, emailService } = await createService({
      name: "external_fixture",
      path: FIXTURE_PATH,
    })

    expect(logger.error).not.toHaveBeenCalled()
    expect(
      emailService.getExternalTemplates().map((t) => t.id)
    ).toContain("external_fixture")
  })

  it("loads a template passed as a module", async () => {
    const { emailService } = await createService({
      name: "external_module",
      module: require(FIXTURE_PATH),
    })

    expect(
      emailService.getExternalTemplates().map((t) => t.id)
    ).toContain("external_module")
  })

  it("logs an error naming the template when the path is broken", async () => {
    const { logger, emailService } = await createService({
      name: "external_broken",
      path: path.join(__dirname, "fixtures/does-not-exist"),
    })

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('"external_broken"')
    )
    expect(
      emailService.getExternalTemplates().map((t) => t.id)
    ).not.toContain("external_broken")
  })
})
