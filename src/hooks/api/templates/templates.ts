import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  useQuery,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query"
import { sdk } from "../../../admin/lib/sdk"

export const useCreateTemplate = (options?: any) => {
  return useMutation<void, FetchError, Record<string, any>>(
    {
      mutationFn: async (data) => {
        await sdk.client.fetch("/admin/mpn/templates", {
          method: "POST",
          body: data,
        })
      },
    }
  )
}

export const useEditTemplate = (options?: any) => {
  return useMutation<void, FetchError, Record<string, any>>(
    {
      mutationFn: async (data) => {
        await sdk.client.fetch("/admin/mpn/templates", {
          method: "POST",
          body: data,
        })
      },
    }
  )
}

export type DeleteTemplateInput = {
  id: string
}

export const useDeleteTemplate = (
  options?: UseMutationOptions<
    void,
    FetchError,
    DeleteTemplateInput
  >
) => {
  return useMutation<
    void,
    FetchError,
    DeleteTemplateInput
  >({
    mutationFn: async ({ id }) => {
      await sdk.client.fetch("/admin/mpn/templates", {
        method: "DELETE",
        body: {
          id: id,
        },
      })
    },
    ...(options as any),
  })
}

export type useListTemplatesParams = {
  id?: string
  limit?: number
  offset?: number
  extraKey?: unknown[]
  enabled?: boolean
  fields?: string
  order?: string
}

type ListTemplatesQueryData = {
  templates: any
  systemTemplates: any
  count: number
  limit: number
  offset: number
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
    id,
  } = params

  const queryKey: QueryKey = [
    "templates",
    id,
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

  if (id) {
    query.id = id
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
        "/admin/mpn/templates",
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
