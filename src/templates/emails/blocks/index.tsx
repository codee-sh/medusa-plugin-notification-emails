import { SectionBlock } from "./components/section"
import { TextBlock } from "./components/text"
import { RepeaterBlock } from "./components/repeater"
import { HeadingBlock } from "./components/heading"
import { RowBlock } from "./components/row"
import { SeparatorBlock } from "./components/separator"
import { ProductItemBlock } from "./components/product-item"

export function BlockRenderer({
  blocks,
  data,
}: {
  blocks: any[]
  data?: any
}) {
  return blocks.map((block, index) => {
    const blockKey = block.id || `block-${index}`
    const isLastBlock = index === blocks.length - 1
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
        if (!data) {
          console.warn("RepeaterBlock requires data prop")
          return null
        }
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
