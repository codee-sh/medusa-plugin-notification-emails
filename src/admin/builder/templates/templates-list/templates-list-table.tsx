import { InformationCircleSolid } from "@medusajs/icons"
import {
  Container,
  Heading,
  DataTable,
  useDataTable,
  createDataTableColumnHelper,
  DataTablePaginationState,
  Tooltip,
  Badge,
  Divider,
} from "@medusajs/ui"
import { useQueryClient } from "@tanstack/react-query"
import { useListTemplatesDb } from "../../../../hooks/api/templates/templates"
import { useState, useMemo } from "react"
import {
  TemplatesEditForm,
  TemplatesCreateForm,
} from "../templates-form"
import { TemplateDeleteButton } from "./components/template-delete-button"
import { Button } from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { useListTemplatesSystem } from "../../../../hooks/api/templates/templates"

export const TemplatesListTable = ({
  title,
  data,
  isLoading,
  type,
}: {
  title: string
  data: any
  isLoading: boolean
  type: string
}) => {
  const navigate = useNavigate()
  const [pagination, setPagination] =
    useState<DataTablePaginationState>({
      pageSize: 8,
      pageIndex: 0,
    })

  const limit = 8
  const offset = useMemo(() => {
    return pagination.pageIndex * limit
  }, [pagination])

  const columnHelper = createDataTableColumnHelper<any>()

  // Memoize columns to prevent re-creation on every render
  // This prevents unmounting of cells when data updates, which would close modals
  const columns = useMemo(
    () => [
      columnHelper.accessor("to", {
        header: "Label",
        cell: ({ row }) => {
          const tooltip = `Device (DB) ID: \n ${row?.original?.id}`
          return (
            <>
              <div className="py-2">
                <div className="flex items-center gap-2 mb-2">
                  <span>{row?.original?.label}</span>
                  {row?.original?.id &&
                  <Tooltip
                    content={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: tooltip,
                        }}
                      />
                    }
                    maxWidth={400}
                  >
                    <InformationCircleSolid />
                  </Tooltip>
                  }
                </div>
                <div className="whitespace-normal text-xs max-w-[180px] min-w-[180px]">
                  <span>{row?.original?.description}</span>
                </div>
              </div>
            </>
          )
        },
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => {
          return <span>{row?.original?.name}</span>
        },
      }),
      columnHelper.accessor("channel", {
        header: "Channel",
        cell: ({ row }) => {
          return <span>{row?.original?.channel}</span>
        },
      }),
      columnHelper.accessor("locale", {
        header: "Locale",
        cell: ({ row }) => {
          return <span>{row?.original?.locale}</span>
        },
      }),
      columnHelper.accessor("subject", {
        header: "Subject",
        cell: ({ row }) => {
          return (
            <span className="whitespace-normal text-xs max-w-[200px] min-w-[200px]">
              {row?.original?.subject || "-"}
            </span>
          )
        },
      }),
      columnHelper.accessor("active", {
        header: "Active",
        cell: ({ row }) => {
          const color = row?.original?.is_active
            ? "green"
            : "red"
          const text = row?.original?.is_active ? "Yes" : "No"

          return (
            <Badge size="small" color={color}>
              {text}
            </Badge>
          )
        },
      }),
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: ({ row }) => {
          if (row?.original?.is_system) {
            return (
              <div className="flex items-center gap-2">
                <Button size="small" variant="primary" onClick={() => navigate(`/mpn/templates/${row?.original?.name}/blocks`)}>Blocks</Button>
              </div>
            )
          }
          
          return (
            <div className="flex items-center gap-2">
              <TemplatesEditForm id={row?.original?.id} />
              <TemplateDeleteButton
                id={row?.original?.id}
              />
              <Button size="small" variant="primary" onClick={() => navigate(`/mpn/templates/${row?.original?.id}/blocks`)}>Blocks</Button>
            </div>
          )
        },
      }),
    ],
    []
  )

  const table = useDataTable({
    columns,
    data: data ?? [],
    isLoading: isLoading,
    // pagination: {
    //   state: pagination,
    //   onPaginationChange: setPagination,
    // },
    // rowCount: templatesData?.count ?? 0,
  })

  return (
    <DataTable instance={table}>
      <DataTable.Toolbar className="flex items-start justify-between gap-2 md:flex-row md:items-center">
        <Heading level="h2">{title}</Heading>
        <TemplatesCreateForm />
      </DataTable.Toolbar>
      {data?.length > 0 && (
        <>
          <DataTable.Table />
        </>
      )}
    </DataTable>  
  )
}
