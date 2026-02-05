import { defineRouteConfig } from "@medusajs/admin-sdk"
import { SingleColumnPage } from "../../components/layout/pages"

const ListPage = () => {
  return (
    <SingleColumnPage
      widgets={{
        before: [],
        after: [],
      }}
    >
      Notifications
    </SingleColumnPage>
  )
}

export const config = defineRouteConfig({
  label: "Notifications",
})

export default ListPage
