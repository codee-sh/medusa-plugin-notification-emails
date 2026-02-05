import {
  Container
} from "@medusajs/ui"
import { useListTemplates } from "../../../../hooks/api/templates/services/templates"
import { TemplatesListTable } from "./templates-list-table"

export const TemplatesList = ({
  title,
  service_id,
  type_id,
}: {
  title: string
  service_id: string
  type_id: string
}) => {
  const {
    data: templatesData,
    isLoading: isTemplatesLoading,
  } = useListTemplates({
    extraKey: [],
    order: "-created_at",
    service_id: service_id,
    type_id: type_id,
  })

  return (
    <>
      {isTemplatesLoading ? (
        <div className="p-6">Loading...</div>
      ) : (
          <TemplatesListTable title={title} data={templatesData?.list || []} isLoading={isTemplatesLoading} type={type_id} />
      )}
    </>
  )
}
