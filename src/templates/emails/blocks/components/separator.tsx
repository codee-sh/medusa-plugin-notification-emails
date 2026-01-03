import { Hr } from "@react-email/components"

/**
 * SeparatorBlock - Separator block component
 *
 */
export function SeparatorBlock({
  id,
  props,
  isLastBlock,
  isFirstBlock,
}: {
  id?: string
  props: any
  isLastBlock: boolean
  isFirstBlock: boolean
}) {
  return <Hr className="my-4 border-ui-border" />
}
