import { useState } from "react"
import {
  Container,
  Heading,
  Select,
  Text,
} from "@medusajs/ui"
import { OrderContextContainer } from "./contexts/order"
// import { ContactFormTemplateGroup } from "../../../notifications-templates/groups/contact-form"

export const BlocksPreviewContainer = ({
  templateId,
}: {
  templateId: string
}) => {
  const [selectedContextType, setSelectedContextType] =
    useState<string>("")

  const contextTypes = [
    {
      label: "Contact Form",
      value: "contact_form",
    },
    { label: "Order", value: "order" },
  ]

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>Preview Template</Heading>
      </div>
      <div className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Text className="w-1/4">
            Choose context:
          </Text>
          <Select
            value={selectedContextType}
            onValueChange={(value) =>
              setSelectedContextType(value)
            }
          >
            <Select.Trigger>
              <Select.Value placeholder="Select a template" />
            </Select.Trigger>
            <Select.Content>
              {contextTypes.map((contextType) => (
                <Select.Item
                  key={contextType.value}
                  value={contextType.value}
                >
                  {contextType.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
        {selectedContextType && (
          <div className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
              <Heading level="h2">
                Choosed context: {selectedContextType}
              </Heading>
            </div>
            {selectedContextType === "order" && (
              <OrderContextContainer contextType={selectedContextType} templateId={templateId} />
            )}
            {/* {selectedContextType === "contact_form" && (
              <ContactFormTemplateGroup />
            )} */}
          </div>
        )}
      </div>
    </Container>
  )
}
