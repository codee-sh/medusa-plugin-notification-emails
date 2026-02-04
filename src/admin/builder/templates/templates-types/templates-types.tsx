import {
  Container
} from "@medusajs/ui"
import { useListTemplateTypes } from "../../../../hooks/api/templates/types"
import { Heading } from "@medusajs/ui"
import { TemplatesServices } from "../templates-services"

export const TemplatesTypes = () => {
  const {
    data: templateTypesData,
    isLoading: isTemplateTypesLoading,
  } = useListTemplateTypes({
    extraKey: [],
    order: "-created_at",
  })

  return (
    <>
      {templateTypesData?.list.map((template: any) => (
        <Container key={template.id} className="p-4">
          <Heading level="h2" className="mb-4">{template.name}</Heading>
          {isTemplateTypesLoading ? (
            <div className="p-6">Loading...</div>
          ) : (
            <TemplatesServices type_id={template.id} />
          )}
        </Container>
      ))}
    </>
  )
}
