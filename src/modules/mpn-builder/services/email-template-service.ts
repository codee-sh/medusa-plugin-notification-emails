import { BaseTemplateService } from "./base-template-service"

export class EmailTemplateService extends BaseTemplateService {
  id = "email"
  label = "Email"

  constructor() {
    super()
    this.initializeBlocks()
  }

  blocks: any[] = [
    {
      type: "heading",
      label: "Headline",
      fields: [
        {
          key: "value",
          label: "Value",
          type: "text",
          required: true,
          name: "value",
          value: "",
          defaultValue: "",
        }
      ],
    },
    {
      type: "text",
      label: "Text",
      fields: [
        {
          key: "value",
          label: "Value",
          type: "textarea",
          required: true,
          name: "value",
          value: "",
          defaultValue: "",
        }
      ],
    },
    {
      type: "row",
      label: "Row",
      fields: [
        {
          key: "label",
          label: "Etykieta",
          type: "text",
          required: true,
          name: "label",
          value: "",
          defaultValue: "",
        },
        {
          key: "value",
          label: "Value",
          type: "text",
          required: true,
          name: "value",
          value: "",
          defaultValue: "",
        },
      ],
    },
    {
      type: "repeater",
      label: "Repeater",
      fields: [
        {
          key: "arrayPath",
          label: "Array path",
          type: "text",
          required: true,
          name: "arrayPath",
          value: "",
          defaultValue: "",
        },
      ],
    },
    {
      type: "group",
      label: "group",
      fields: [],
    },
    {
      type: "separator",
      label: "Separator",
      fields: [],
    },
  ]

  /**
   * Initialize default email templates
   * Email templates are managed by @codee-sh/medusa-plugin-notification-emails
   * This method can be used to register custom templates if needed
   */
  protected initializeBlocks(): void {
    // Email templates are handled by external plugin
    // Custom templates can be registered here if needed
  }
}
