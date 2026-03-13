import { BlocksTreeList } from "../components/blocks-tree-list"

export const BlocksChildren = (props: any) => {
  const { blocks, form, path, sensors } = props

  const childrenPath = `${path}.children`

  return (
    <BlocksTreeList
      path={childrenPath}
      blocks={blocks}
      form={form}
      sensors={sensors}
    />
  )
}
