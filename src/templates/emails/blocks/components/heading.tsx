import { Heading } from "@react-email/components"
import { clx } from "@medusajs/ui"

/**
 * HeadingBlock - Heading block component
 *
 */
export function HeadingBlock({
  id,
  props,
  data,
  isLastBlock,
  isFirstBlock,
}: {
  id?: string
  props: any
  data?: any
  isLastBlock: boolean
  isFirstBlock: boolean
}) {
  const className = clx(
    "text-xl",
    "font-bold",
    isLastBlock ? "mb-0" : "mb-4",
    isFirstBlock ? "mt-0" : "mt-4"
  )

  return (
    <Heading className={className}>{props.value}</Heading>
  )
}
