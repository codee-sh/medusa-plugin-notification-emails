import { SectionBlock } from "./components/section"
import { TextBlock } from "./components/text"
import { RepeaterBlock } from "./components/repeater"
import { HeadingBlock } from "./components/heading"
import { RowBlock } from "./components/row"
import { SeparatorBlock } from "./components/separator"
import { ProductItemBlock } from "./components/product-item"
import { GroupBlock } from "./components/group"

/**
 * Block types skipped when their `value` prop is empty or whitespace
 */
const VALUE_BLOCK_TYPES = ["heading", "text", "row"]

function isEmptyValue(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  )
}

function isRenderable(block: any): boolean {
  return !(
    VALUE_BLOCK_TYPES.includes(block.type) &&
    isEmptyValue(block.props?.value)
  )
}

export function BlockRenderer({
  blocks,
  data,
}: {
  blocks: any[]
  data?: any
}) {
  const visibleBlocks = blocks.filter(isRenderable)

  return visibleBlocks.map((block, index) => {
    const blockKey = block.id || `block-${index}`
    const isLastBlock = index === visibleBlocks.length - 1
    const isFirstBlock = index === 0

    switch (block.type) {
      case "section":
        return (
          <SectionBlock
            key={blockKey}
            id={blockKey}
            props={block.props}
            data={data}
            isLastBlock={isLastBlock}
            isFirstBlock={isFirstBlock}
          />
        )
      case "group":
        return (
          <GroupBlock
            key={blockKey}
            id={blockKey}
            props={block.props}
            data={data}
          />
        )
      case "row":
        return (
          <RowBlock
            key={blockKey}
            id={blockKey}
            props={block.props}
            data={data}
            isLastBlock={isLastBlock}
            isFirstBlock={isFirstBlock}
          />
        )
      case "product-item":
        return (
          <ProductItemBlock
            key={blockKey}
            id={blockKey}
            props={block.props}
            data={data}
            isLastBlock={isLastBlock}
            isFirstBlock={isFirstBlock}
          />
        )
      case "heading":
        return (
          <HeadingBlock
            key={blockKey}
            id={blockKey}
            props={block.props}
            data={data}
            isLastBlock={isLastBlock}
            isFirstBlock={isFirstBlock}
          />
        )
      case "text":
        return (
          <TextBlock
            key={blockKey}
            id={blockKey}
            props={block.props}
            isLastBlock={isLastBlock}
            isFirstBlock={isFirstBlock}
          />
        )
      case "separator":
        return (
          <SeparatorBlock
            key={blockKey}
            id={blockKey}
            props={block.props}
            isLastBlock={isLastBlock}
            isFirstBlock={isFirstBlock}
          />
        )
      case "repeater":
        return (
          <RepeaterBlock
            key={blockKey}
            id={blockKey}
            props={block.props}
            data={data}
          />
        )
      default:
        return null
    }
  }) as React.ReactElement[]
}
