import { model } from "@medusajs/framework/utils"
import MpnBuilderTemplate from "./builder_template"

const MpnBuilderTemplateBlock = model.define("mpn_builder_template_block", {
  id: model.id().primaryKey(),
  type: model.text(), // "group", "heading", "text", "row", "separator", "repeater", "table", etc.
  parent_id: model.text().nullable(), // self-reference dla hierarchii
  position: model.number().default(0),
  metadata: model.json().nullable(),
  template: model.belongsTo(() => MpnBuilderTemplate, { mappedBy: "blocks" }),
})

export default MpnBuilderTemplateBlock
