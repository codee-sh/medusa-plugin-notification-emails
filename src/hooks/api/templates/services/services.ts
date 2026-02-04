import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery
} from "@tanstack/react-query"
import { sdk } from "../../../../admin/lib/sdk"

export type useListTemplateServicesParams = {
  limit?: number
  offset?: number
  extraKey?: string[]
  enabled?: boolean
  type_id?: string
}

type ListTemplateServicesQueryData = {
  list: any[]
}

export const useListTemplateServices = (
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
    type_id,
  } = params

  const queryKey: QueryKey = [
    "types-services",
    limit,
    offset,
    type_id,
    ...extraKey,
  ]

  const query: any = {
    limit,
    offset,
    fields,
    order,
    type_id,
  }

  const { data, ...rest } = useQuery<
    ListTemplateServicesQueryData,
    FetchError,
    ListTemplateServicesQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        `/admin/mpn/templates/types/${type_id}/services`,
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