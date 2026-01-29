import { defineRouteConfig } from "@medusajs/admin-sdk"
import { SingleColumnPage } from "../../../../../components/layout/pages"
import { BlocksContainer } from "../../../../../builder/blocks"
import { useParams } from "react-router-dom"

const ListPage = () => {
  const { id } = useParams()

  return (
    <SingleColumnPage
      widgets={{
        before: [],
        after: [],
      }}
    >
      <BlocksContainer id={id ?? ""} />
    </SingleColumnPage>
  )
}

export const config = defineRouteConfig({
  label: "Blocks",
})

export default ListPage
