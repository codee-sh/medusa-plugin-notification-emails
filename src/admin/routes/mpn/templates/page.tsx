import { defineRouteConfig } from "@medusajs/admin-sdk"
import { SingleColumnPage } from "../../../components/layout/pages"
import { TemplatesList } from "../../../builder/templates/templates-list"

const ListPage = () => {
  return (
    <SingleColumnPage
      widgets={{
        before: [],
        after: [],
      }}
    >
      <TemplatesList />
    </SingleColumnPage>
  )
}

export const config = defineRouteConfig({
  label: "Templates",
})

export default ListPage
