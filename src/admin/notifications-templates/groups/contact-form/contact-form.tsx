import { useEffect, useState } from "react"
import { Alert } from "@medusajs/ui"
import { usePreview } from "../../../../hooks/api/preview"
import { contactFormMockData } from "../../../../../emails-previews/contact-form"
import { TEMPLATES_EMAILS_NAMES } from "../../../../modules/mpn-builder/types"

export const ContactFormTemplate = () => {
  const [context, setContext] = useState<any>(null)
  const [previewContext, setPreviewData] =
    useState<any>(null)

  useEffect(() => {
    setContext(contactFormMockData)
  }, [])

  const { data: preview, isLoading: isPreviewLoading } =
    usePreview({
      templateName: TEMPLATES_EMAILS_NAMES.CONTACT_FORM,
      context: context,
      contextType: "contact_form",
      locale: "pl",
      enabled: !!context,
      extraKey: [context],
    })

  useEffect(() => {
    if (preview) {
      setPreviewData(preview)
    }
  }, [preview])

  return (
    <div className="px-6 py-4">
      {isPreviewLoading && (
        <Alert variant="info">Loading preview...</Alert>
      )}
      {previewContext && (
        <div className="px-6 py-4">
          <iframe
            srcDoc={previewContext?.html || ""}
            style={{
              width: "100%",
              border: "none",
              minHeight: "600px",
            }}
            sandbox="allow-same-origin"
          />
        </div>
      )}
    </div>
  )
}
