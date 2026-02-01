import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useParams } from "react-router-dom"
import { SingleColumnPage } from "../../../../../components/layout/pages"
import { BlocksContainer } from "../../../../../builder/blocks"
import { BlocksPreviewContainer } from "../../../../../builder/blocks/blocks-preview/blocks-preview-container"

const ListPage = () => {
  const { id } = useParams()

  return (
    <SingleColumnPage
      widgets={{
        before: [],
        after: [],
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <BlocksContainer id={id ?? ""} />
        </div>
        <div className="col-span-1">
          <BlocksPreviewContainer templateId={id ?? ""} />
        </div>
      </div>
    </SingleColumnPage>
  )
}

export const config = defineRouteConfig({
  label: "Blocks",
})

export default ListPage
