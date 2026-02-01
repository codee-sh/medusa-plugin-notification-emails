import { useEffect, useState } from "react"
import { Alert } from "@medusajs/ui"
import { usePreview } from "../../../../hooks/api/preview"
import { contactFormMockData } from "../../../../../emails-previews/contact-form"
import { TEMPLATES_EMAILS_NAMES } from "../../../../modules/mpn-builder/types"

export const BlocksPreview = ({ contextType, templateId, context }: { contextType: string, templateId: string, context: any }) => {
  const [previewContext, setPreviewData] =
    useState<any>(null)

  const { data: preview, isLoading: isPreviewLoading } =
    usePreview({
      templateId: templateId,
      context: context,
      contextType: contextType,
      locale: "pl",
      enabled: !!context,
      extraKey: [context],
    })

  // console.log("context", context)
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
