import {
  Container
} from "@medusajs/ui"
import { useListTemplateServices } from "../../../../hooks/api/templates/services"
import { Heading } from "@medusajs/ui"
import { TemplatesList } from "../templates-list"

export const TemplatesServices = ({
  type_id,
}: {
  type_id: string
}) => {
  const {
    data: templateServicesData,
    isLoading: isTemplateServicesLoading,
  } = useListTemplateServices({
    extraKey: [],
    order: "-created_at",
    type_id: type_id,
  })

  return (
    <>
      {templateServicesData?.list.map((service: any) => (
        <Container key={service.id} className="pb-2 pt-0 px-0 mb-4">
          {isTemplateServicesLoading ? (
            <div className="p-6">Loading...</div>
          ) : (
            <TemplatesList title={service.label} service_id={service.id} type_id={type_id} />
          )}
        </Container>
      ))}
    </>
  )
}
