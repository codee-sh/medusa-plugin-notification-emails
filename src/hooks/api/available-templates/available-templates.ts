import { FetchError } from "@medusajs/js-sdk"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { sdk } from "../../../admin/lib/sdk"

export type AvailableTemplatesQueryData = {
  templates: any[]
}

export const useAvailableTemplates = (
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
    id,
    type, // Add type parameter
  } = params

  const queryKey: QueryKey = [
    "available-templates",
    limit,
    offset,
    type, // Include type in query key for proper caching
    ...extraKey,
  ]

  const query: any = {
    limit,
    offset,
    fields,
    order,
    ...(type && { type }), // Add type to query params if provided
  }

  const { data, ...rest } = useQuery<
    AvailableTemplatesQueryData,
    FetchError,
    AvailableTemplatesQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        "/admin/mpn/available-templates",
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
