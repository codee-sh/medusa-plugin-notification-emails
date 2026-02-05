import { model } from "@medusajs/framework/utils"
import MpnBuilderTemplateBlock from "./builder_template_block"

const MpnBuilderTemplate = model.define("mpn_builder_template", {
  id: model.id().primaryKey(),
  name: model.text().unique(),
  label: model.text().nullable(),
  description: model.text().nullable(),
  channel: model.text(), // "email" | "slack" | "sms"
  locale: model.text(), // "pl" | "en" | ...
  // event_type: model.text().nullable(), // "order.placed", "inventory.updated"
  subject: model.text().nullable(),
  is_active: model.boolean().default(true),
  blocks: model.hasMany(() => MpnBuilderTemplateBlock, {
    mappedBy: "template",
  }),
}).indexes([
  {
    on: ["id"],
    unique: true,
  },
  {
    on: ["name"],
    unique: true,
  },
])

export default MpnBuilderTemplate
