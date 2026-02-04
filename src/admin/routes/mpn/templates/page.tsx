import { defineRouteConfig } from "@medusajs/admin-sdk"
import { SingleColumnPage } from "../../../components/layout/pages"
import { TemplatesTypes } from "../../../builder/templates/templates-types"

const ListPage = () => {
  return (
    <SingleColumnPage
      widgets={{
        before: [],
        after: [],
      }}
    >
      <TemplatesTypes />
    </SingleColumnPage>
  )
}

export const config = defineRouteConfig({
  label: "Templates",
})

export default ListPage
