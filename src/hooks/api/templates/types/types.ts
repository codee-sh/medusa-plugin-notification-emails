import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery
} from "@tanstack/react-query"
import { sdk } from "../../../../admin/lib/sdk"

export type useListTemplateTypesParams = {
  limit?: number
  offset?: number
  extraKey?: string[]
  enabled?: boolean
}

type ListTemplateTypesQueryData = {
  list: any[]
}

export const useListTemplateTypes = (
  params: any,
  options?: any
) => {
  const {
    limit = 100,
    offset = 0,
    extraKey = [],
    enabled,
    fields,
    order = "created_at",
  } = params

  const queryKey: QueryKey = [
    "template-types",
    limit,
    offset,
    ...extraKey,
  ]

  const query: any = {
    limit,
    offset,
    fields,
    order,
  }

  const { data, ...rest } = useQuery<
    ListTemplateTypesQueryData,
    FetchError,
    ListTemplateTypesQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        "/admin/mpn/templates/types",
        {
          method: "GET",
          query,
        }
      )
    },
    enabled,
    ...(options as any),
  })

  return { data, ...rest }
}