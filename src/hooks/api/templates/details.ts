import { FetchError } from "@medusajs/js-sdk"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { sdk } from "../../../admin/lib/sdk"

type TemplateDetailsQueryData = {
  template: any
}

export const useTemplateDetails = (
  params: {
    template_id?: string
    enabled?: boolean
    extraKey?: unknown[]
  },
  options?: any
) => {
  const {
    template_id,
    enabled = true,
    extraKey = [],
  } = params

  const queryKey: QueryKey = [
    "template-details",
    template_id,
    ...extraKey,
  ]

  const { data, ...rest } = useQuery<
    TemplateDetailsQueryData,
    FetchError
  >({
    queryKey,
    queryFn: async () => {
      return await sdk.client.fetch(
        `/admin/mpn/templates/${template_id}/details`,
        {
          method: "GET",
        }
      )
    },
    enabled: Boolean(template_id) && enabled,
    ...(options as any),
  })

  return { data, ...rest }
}
