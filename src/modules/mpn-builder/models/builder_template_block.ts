import { model } from "@medusajs/framework/utils"
import MpnBuilderTemplate from "./builder_template"

const MpnBuilderTemplateBlock = model.define("mpn_builder_template_block", {
  id: model.id().primaryKey(),
  type: model.text(),
  parent_id: model.text().nullable(),
  position: model.number().default(0),
  metadata: model.json().nullable(),
  template: model.belongsTo(() => MpnBuilderTemplate, { mappedBy: "blocks" }),
}).indexes([
  {
    on: ["id"],
    unique: true,
  },
  {
    on: ["template_id"],
    unique: false,
  },
  {
    on: ["parent_id"],
    unique: false,
  },
])

export default MpnBuilderTemplateBlock
