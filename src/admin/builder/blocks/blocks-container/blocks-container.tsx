import {
  Container,
  Heading,
} from "@medusajs/ui"
import { useMemo, useState, useEffect } from "react"

import { useAvailableTemplates } from "../../../../hooks/api/available-templates"
import { BlocksForm } from "../blocks-form/blocks-form"
import { useListTemplateBlocks } from "../../../../hooks/api/templates/blocks"

export const BlocksContainer = ({ id, type = "email" }: { id: string, type?: string }) => {
  const { data: availableTemplates } = useAvailableTemplates({
    type: type,
  })

  const { data: blocks, isLoading: isBlocksLoading } = useListTemplateBlocks({
    template_id: id
  })

  const [template, setTemplate] = useState<any>(null)

  useEffect(() => {
    if (availableTemplates?.templates && type) {
      setTemplate(availableTemplates.templates.find((t) => t.id === type))
    }
  }, [availableTemplates])

  return (
    <Container className="px-6 py-4">
      <Heading level="h1" className="mb-2">Blocks list for {type} template</Heading>

      {template && !isBlocksLoading && (
        <BlocksForm template_id={id} template={template} blocks={template.blocks} items={blocks?.tree} />
      ) }
    </Container>
  )
}
