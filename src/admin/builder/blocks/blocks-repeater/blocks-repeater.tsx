import { BlockItemFields } from "../components/block-item-fields"
import { BlocksTreeList } from "../components/blocks-tree-list"

export const BlocksRepeater = (props: any) => {
  const { blocks, form, path, sensors } = props

  const childrenPath = `${path}.children`
  const index = parseInt(path.split(".")[1])
  const field = form.watch(path)

  return (
    <>
      {/* Array Path field */}
      <div className="mb-4">
        <BlockItemFields
          path={path}
          index={index}
          field={field}
          blocks={blocks}
          form={form}
        />
      </div>

      {/* Children blocks */}
      <BlocksTreeList
        path={childrenPath}
        blocks={blocks}
        form={form}
        sensors={sensors}
      />
    </>
  )
}
