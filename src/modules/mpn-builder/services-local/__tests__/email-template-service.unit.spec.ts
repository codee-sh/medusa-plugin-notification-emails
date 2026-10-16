import { EmailTemplateService } from "../email-template-service"

const TEMPLATE_NAME = "external_test-report"

const translations = {
  en: {
    general: {
      headerTitle: "Report {{data.job_id}}",
    },
  },
}

/**
 * Registers a template with the given blocks the way the module registers an external one
 */
function createService(templateBlocks: any[]) {
  const service = new EmailTemplateService()

  service.registerTemplate(
    TEMPLATE_NAME,
    {
      ...service.baseTemplateConfig,
      getConfig: () => ({
        blocks: templateBlocks,
        translations,
      }),
    },
    "external"
  )

  return service
}

function prepareBlocks(
  service: EmailTemplateService,
  data: Record<string, any>
): any[] {
  return (service as any).prepareData({
    templateName: TEMPLATE_NAME,
    data,
    options: { locale: "en" },
  }).blocks
}

const repeater = (props: Record<string, any>) => ({
  id: "rows",
  type: "repeater",
  props: { arrayPath: "rows", ...props },
})

describe("EmailTemplateService repeater", () => {
  it("renders every item block for every item, in order", () => {
    const service = createService([
      repeater({
        itemBlocks: [
          {
            id: "title",
            type: "heading",
            props: { value: "{{data.rows.title}}" },
          },
          {
            id: "message",
            type: "text",
            props: { value: "{{data.rows.message}}" },
          },
        ],
      }),
    ])

    const [rendered] = prepareBlocks(service, {
      rows: [1, 2, 3].map((n) => ({
        title: `T${n}`,
        message: `M${n}`,
      })),
    })

    expect(
      rendered.props.itemBlocks.map(
        (block: any) => block.props.value
      )
    ).toEqual(["T1", "M1", "T2", "M2", "T3", "M3"])
  })

  it("interpolates a block nested inside an item block against the item", () => {
    const service = createService([
      repeater({
        itemBlocks: [
          {
            id: "group",
            type: "section",
            props: {
              blocks: [
                {
                  id: "message",
                  type: "text",
                  props: { value: "{{data.rows.message}}" },
                },
              ],
            },
          },
        ],
      }),
    ])

    const [rendered] = prepareBlocks(service, {
      rows: [{ message: "Nested value" }],
    })

    expect(
      rendered.props.itemBlocks[0].props.blocks[0].props
        .value
    ).toBe("Nested value")
  })

  it("renders no placeholder for an empty array", async () => {
    const service = createService([
      repeater({
        itemBlocks: [
          {
            id: "message",
            type: "text",
            props: { value: "{{data.rows.message}}" },
          },
        ],
      }),
    ])

    const { html, text } = await service.render({
      templateName: TEMPLATE_NAME,
      data: { job_id: "job_1", rows: [] },
      options: { locale: "en" },
    })

    expect(html).not.toContain("{{")
    expect(text).not.toContain("{{")
  })

  it("renders emptyBlocks for an empty array", async () => {
    const service = createService([
      repeater({
        itemBlocks: [
          {
            id: "message",
            type: "text",
            props: { value: "{{data.rows.message}}" },
          },
        ],
        emptyBlocks: [
          {
            id: "empty",
            type: "text",
            props: { value: "Nothing to report" },
          },
        ],
      }),
    ])

    const { html } = await service.render({
      templateName: TEMPLATE_NAME,
      data: { rows: [] },
      options: { locale: "en" },
    })

    expect(html).toContain("Nothing to report")
  })
})

describe("EmailTemplateService rendering", () => {
  it("shows data with markup characters as text", async () => {
    const service = createService([
      {
        id: "message",
        type: "text",
        props: { value: "{{data.message}}" },
      },
      {
        id: "row",
        type: "row",
        props: { label: "Value", value: "{{data.row}}" },
      },
    ])

    const { html, text } = await service.render({
      templateName: TEMPLATE_NAME,
      data: { message: "A < B & C", row: "<b>bold</b>" },
      options: { locale: "en" },
    })

    expect(html).toContain("A &lt; B &amp; C")
    expect(html).toContain("&lt;b&gt;bold&lt;/b&gt;")
    expect(html).not.toContain("<b>bold</b>")
    expect(text).toContain("A < B & C")
  })

  it("keeps replacement patterns and placeholders in data literal", async () => {
    const service = createService([
      {
        id: "a",
        type: "text",
        props: { value: "{{data.a}}" },
      },
      {
        id: "b",
        type: "text",
        props: { value: "{{data.b}}" },
      },
    ])

    const { text } = await service.render({
      templateName: TEMPLATE_NAME,
      data: { a: "$& test", b: "{{data.x}}", x: "no" },
      options: { locale: "en" },
    })

    expect(text).toContain("$& test")
    expect(text).toContain("{{data.x}}")
  })

  it("skips a heading with an empty value", async () => {
    const service = createService([
      {
        id: "title",
        type: "heading",
        props: { value: "" },
      },
      {
        id: "missing",
        type: "heading",
        props: { value: "{{data.missing}}" },
      },
      {
        id: "message",
        type: "text",
        props: { value: "Body" },
      },
    ])

    const { html } = await service.render({
      templateName: TEMPLATE_NAME,
      data: {},
      options: { locale: "en" },
    })

    expect(html).not.toMatch(/<h[1-6]/)
    expect(html).toContain("Body")
  })

  it("takes the subject from options, interpolated and not escaped", async () => {
    const service = createService([])

    const custom = await service.render({
      templateName: TEMPLATE_NAME,
      data: { job_id: "A&B" },
      options: {
        locale: "en",
        subject: "Sync {{data.job_id}}",
      },
    })
    const fallback = await service.render({
      templateName: TEMPLATE_NAME,
      data: { job_id: "A&B" },
      options: { locale: "en" },
    })

    expect(custom.subject).toBe("Sync A&B")
    expect(fallback.subject).toBe("Report A&B")
  })
})
