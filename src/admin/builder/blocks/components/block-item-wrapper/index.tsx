import { Heading } from "@medusajs/ui"

export function BlockItemWrapper(props) {
  const { index, blocks, field } = props
  
  const availableBlock = blocks.find((b) => b.type === field.type)

  return (
    <>
      <Heading level="h2" className="mb-2">Block title: {availableBlock.label} <span className="text-ui-fg-subtle text-xs">(position: {index})</span></Heading>
      
      {props.children}
    </>
  )
}
