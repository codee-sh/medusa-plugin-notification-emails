import {
  Container
} from "@medusajs/ui"
import { useListTemplates } from "../../../../hooks/api/templates"
import { useListTemplatesSystem } from "../../../../hooks/api/templates/templates"
import { TemplatesListTable } from "./templates-list-table"

export const TemplatesList = () => {
  const {
    data: templatesData,
    isLoading: isTemplatesLoading,
  } = useListTemplates({
    extraKey: [],
    order: "-created_at",
  })

  const {
    data: systemTemplatesData,
    isLoading: isSystemTemplatesLoading,
  } = useListTemplatesSystem({
    extraKey: [],
    order: "-created_at",
  })

  return (
    <>
      <Container className="p-0">
        {templatesData?.templates.map((template: any) => (
          <TemplatesListTable title={`DB ${template.label} templates`} data={template.templates} isLoading={isTemplatesLoading} type="db" />
        ))}
      </Container>
      <Container className="p-0">
        {systemTemplatesData?.templates.map((template: any) => (
          <TemplatesListTable title={`System ${template.label} templates`} data={template.templates} isLoading={isSystemTemplatesLoading} type="system" />
        ))}
      </Container>
    </>
  )
}
