import {
  createTranslator,
  escapeHtml,
  multiInterpolate,
} from "../i18n"

const translator = createTranslator("en", {
  en: {
    general: {
      title: "<b>Report</b> {{data.name}}",
    },
  },
})

describe("multiInterpolate", () => {
  it("inserts a data value as is", () => {
    expect(
      multiInterpolate(
        "Hi {{data.name}}",
        { name: "Ann" },
        translator
      )
    ).toBe("Hi Ann")
  })

  it("does not expand replacement patterns inside a value", () => {
    expect(
      multiInterpolate(
        "{{data.a}} and {{data.b}}",
        { a: "$& test", b: "$1 $$" },
        translator
      )
    ).toBe("$& test and $1 $$")
  })

  it("does not interpolate a placeholder inside a value", () => {
    expect(
      multiInterpolate(
        "{{data.a}} / {{data.b}}",
        { a: "{{data.b}}", b: "B" },
        translator
      )
    ).toBe("{{data.b}} / B")
  })

  it("escapes data values but keeps translation markup", () => {
    expect(
      multiInterpolate(
        "{{translations.title}} - {{data.note}}",
        { name: "A < B & C", note: "<i>x</i>" },
        translator,
        { escape: escapeHtml }
      )
    ).toBe(
      "<b>Report</b> A &lt; B &amp; C - &lt;i&gt;x&lt;/i&gt;"
    )
  })

  it("keeps a missing data placeholder unless emptyMissing is set", () => {
    expect(
      multiInterpolate("[{{data.missing}}]", {}, translator)
    ).toBe("[{{data.missing}}]")
    expect(
      multiInterpolate(
        "[{{data.missing}}]",
        {},
        translator,
        {
          emptyMissing: true,
        }
      )
    ).toBe("[]")
  })

  it("reads repeater items through the array path prefix", () => {
    expect(
      multiInterpolate(
        "{{data.rows.message}}",
        { message: "Missing postal code" },
        translator,
        { arrayPath: "rows" }
      )
    ).toBe("Missing postal code")
  })
})
