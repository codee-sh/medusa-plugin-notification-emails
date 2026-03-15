import { ORDER_TEMPLATE_FIELDS } from "./order"
import type { DataContextDefinition } from "../../types"

const ORDER_CONTEXT: DataContextDefinition = {
  id: "order",
  label: "Order",
  description: "Order related context data",
  fields: ORDER_TEMPLATE_FIELDS,
}

export const INTERNAL_DATA_CONTEXTS: DataContextDefinition[] =
  [ORDER_CONTEXT]
