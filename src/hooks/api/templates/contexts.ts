import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery,
} from "@tanstack/react-query"
import { sdk } from "../../../admin/lib/sdk"

type ListTemplateContextsQueryData = {
  list: Array<{
    source: "internal" | "external"
    label: string
    items: Array<{
      id: string
      label: string
      description?: string | null
      source: "internal" | "external"
    }>
  }>
}

export const useListTemplateContexts = (
  options?: any
) => {
  const queryKey: QueryKey = ["template-contexts"]

  const { data, ...rest } = useQuery<
    ListTemplateContextsQueryData,
    FetchError
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        "/admin/mpn/templates/contexts",
        {
          method: "GET",
        }
      )
    },
    ...(options as any),
  })

  return { data, ...rest }
}
