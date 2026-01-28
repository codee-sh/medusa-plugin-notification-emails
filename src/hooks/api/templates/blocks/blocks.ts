import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query"
import { sdk } from "../../../../admin/lib/sdk"

export const useEditTemplateBlocks = (options?: any) => {
  return useMutation<void, FetchError, Record<string, any>>(
    {
      mutationFn: async (data) => {
        await sdk.client.fetch(`/admin/mpn/templates/${data.template_id}/blocks`, {
          method: "POST",
          body: data,
        })
      },
    }
  )
}

export type useListTemplateBlocksParams = {
  template_id: string
  id?: string
  limit?: number
  offset?: number
  extraKey?: unknown[]
  enabled?: boolean
  fields?: string
  order?: string
}

type ListTemplateBlocksQueryData = {
  blocks: any
  count: number
  limit: number
  offset: number
}

export const useListTemplateBlocks = (
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
    template_id,
  } = params

  const queryKey: QueryKey = [
    "template-blocks",
    template_id
  ]

  const query: any = {
    limit,
    offset,
    fields,
    order,
  }

  if (id) {
    query.id = id
  }

  if (template_id) {
    query.template_id = template_id
  }

  const { data, ...rest } = useQuery<
    ListTemplateBlocksQueryData,
    FetchError,
    ListTemplateBlocksQueryData,
    QueryKey
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        `/admin/mpn/templates/${template_id}/blocks`,
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
