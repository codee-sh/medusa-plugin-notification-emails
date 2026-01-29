import { defineRouteConfig } from "@medusajs/admin-sdk"
import { SingleColumnPage } from "../../../../../components/layout/pages"
import { BlocksContainer } from "../../../../../builder/blocks"
import { useParams } from "react-router-dom"
import { TwoColumnPage } from "../../../../../components/layout/pages/two-column-page/two-column-page"

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
          View email preview
        </div>
      </div>
    </SingleColumnPage>
  )
}

export const config = defineRouteConfig({
  label: "Blocks",
})

export default ListPage
