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
    <Container className="divide-y py-0 px-0">
      <div className="flex items-center justify-between px-4 py-3">
        <Heading level="h2">Preview</Heading>
      </div>
      <div className="divide-y p-0">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5">
          <Text size="xsmall" className="w-1/4 text-ui-fg-subtle">
            Choose context
          </Text>
          <div className="w-full">
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
        </div>
        {selectedContextType && (
          <div className="divide-y p-0">
            <div className="flex items-center justify-between px-4 py-3">
              <Heading level="h3">
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
