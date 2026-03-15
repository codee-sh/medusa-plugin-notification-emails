import { Container } from "@medusajs/ui"
import { useMemo } from "react"

import { useAvailableTemplates } from "../../../../hooks/api/available-templates"
import { BlocksForm } from "../blocks-form/blocks-form"
import { useListTemplateBlocks } from "../../../../hooks/api/templates/blocks"
import { useTemplateDetails } from "../../../../hooks/api/templates"

export const BlocksContainer = ({
  id,
  type = "email",
}: {
  id: string
  type?: string
}) => {
  const {
    data: templateDetailsData,
    isLoading: isTemplateLoading,
  } = useTemplateDetails({
    template_id: id,
    enabled: Boolean(id),
  })

  const templateDetails = templateDetailsData?.template

  const { data: availableTemplates } =
    useAvailableTemplates({
      type: templateDetails?.channel || type,
    })

  const { data: blocks, isLoading: isBlocksLoading } =
    useListTemplateBlocks({
      template_id: id,
    })

  const templateService = useMemo(() => {
    if (
      !availableTemplates?.templates ||
      !templateDetails?.channel
    ) {
      return null
    }

    return availableTemplates.templates.find(
      (service: any) =>
        service.id === templateDetails.channel
    )
  }, [availableTemplates, templateDetails?.channel])

  const blocksDefinitions = templateService?.blocks || []

  return (
    <div className="">
      {templateDetails &&
        !isBlocksLoading &&
        !isTemplateLoading && (
          <BlocksForm
            template_id={id}
            template={templateDetails}
            blocks={blocksDefinitions}
            items={blocks?.tree}
          />
        )}
    </div>
  )
}
