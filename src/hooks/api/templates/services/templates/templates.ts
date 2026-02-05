import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery
} from "@tanstack/react-query"
import { sdk } from "../../../../../admin/lib/sdk"

export type useListTemplatesParams = {
  limit?: number
  offset?: number
  extraKey?: string[]
  enabled?: boolean
  type?: string
  service_id?: string
}

type ListTemplatesQueryData = {
  list: any[]
}

export const useListTemplates = (
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
    service_id,
  } = params

  const queryKey: QueryKey = [
    "types-services-templates",
    limit,
    offset,
    type_id,
    service_id,
    ...extraKey,
  ]

  const query: any = {
    limit,
    offset,
    fields,
    order,
    service_id,
    type_id,
  }

  const { data, ...rest } = useQuery<
    ListTemplatesQueryData,
    FetchError,
    ListTemplatesQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        `/admin/mpn/templates/types/${type_id}/services/${service_id}/templates`,
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