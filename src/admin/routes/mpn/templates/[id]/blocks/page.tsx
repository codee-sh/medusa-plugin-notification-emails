import { defineRouteConfig } from "@medusajs/admin-sdk"
import { SingleColumnPage } from "../../../../../components/layout/pages"
import { BlocksList } from "../../../../../templates/blocks"
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
      <BlocksList id={id ?? ""} />
    </SingleColumnPage>
  )
}

export const config = defineRouteConfig({
  label: "Blocks",
})

export default ListPage
