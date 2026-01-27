import {
  Button,
  FocusModal,
  ProgressTabs,
  toast,
  Heading,
} from "@medusajs/ui"
import { Pencil } from "@medusajs/icons"
import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import {
  useEditTemplate,
  useListTemplates,
} from "../../../../hooks/api/templates"
import {
  TemplateFormValues,
  Tab,
  TabState,
} from "../types"
import { baseTemplateFormSchema } from "../types/schema"
import { TemplatesGeneralForm } from "../templates-general-form"

export function TemplatesEditForm({
  id,
}: {
  id: string
}) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>(Tab.GENERAL)
  const [tabState, setTabState] = useState<TabState>({
    [Tab.GENERAL]: "in-progress",
  })
  const [buttonText, setButtonText] = useState<string>("")
  const [eventName, setEventName] = useState<
    string | undefined
  >(undefined)

  useEffect(() => {
    if (Tab.GENERAL === tab) {
      setButtonText("Save template")
    }
  }, [tab])

  const queryClient = useQueryClient()

  const {
    data: templatesData,
    isLoading: isTemplatesLoading,
  } = useListTemplates({
    id: id,
    extraKey: [],
    enabled: open && !!id,
  })

  const {
    mutateAsync: editTemplate,
    isPending: isEditTemplatePending,
  } = useEditTemplate()

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(baseTemplateFormSchema),
    defaultValues: {
      general: {
        name: "",
        label: "",
        description: "",
        channel: "email",
        locale: "en",
        is_active: true,
      },
    },
  })

  // Update form when data is loaded and modal is open
  useEffect(() => {
    if (
      templatesData
    ) {
      const template = templatesData?.templates?.[0]
      form.reset({
        general: {
          name: template.name || "",
          label: template.label || "",
          description: template.description || "",
          channel: template.channel || "email",
          locale: template.locale || "en",
          is_active: template.is_active || true,
        },
      })
    }
  }, [open, templatesData])

  // Reset form when modal is closed
  useEffect(() => {
    if (open === false) {
      setEventName(undefined)
      setTab(Tab.GENERAL)

      form.reset({
        general: {
          name: "",
          label: "",
          description: "",
          channel: "email",
          locale: "en",
          is_active: true,
        },
      })
    }
  }, [open])

  async function handleSubmit(data: TemplateFormValues) {
    if (Tab.GENERAL === tab) {
      const items = {
        id: id,
        name: data.general.name,
        label: data.general.label,
        description: data.general.description,
        channel: data.general.channel,
        locale: data.general.locale,
        is_active: data.general.is_active,
      }

      await editTemplate({
        id: id,
        items: [items],
      })

      queryClient.invalidateQueries({
        queryKey: ["templates"],
      })

      toast.success("Template updated successfully", {
        position: "top-right",
        duration: 3000,
      })
    }
  }

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button size="small" variant="primary">
          <Pencil />
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <Heading level="h3" className="shrink-0">
            Edit Automation
          </Heading>
          <div className="-my-2 w-full border-l">
            <ProgressTabs
              dir="ltr"
              value={tab}
              className="flex h-full flex-col overflow-hidden"
            >
              <ProgressTabs.List className="justify-start-start flex w-full items-center">
                <ProgressTabs.Trigger
                  value={Tab.GENERAL}
                  status={tabState[Tab.GENERAL]}
                >
                  General
                </ProgressTabs.Trigger>
              </ProgressTabs.List>
            </ProgressTabs>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="w-full overflow-y-auto">
          {isTemplatesLoading ? (
            <div className="p-6">Loading...</div>
          ) : (
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              {tab === Tab.GENERAL && (
                <TemplatesGeneralForm
                  form={form}
                  isOpen={open}
                  isEditMode={!!id}
                />
              )}
            </form>
          )}
        </FocusModal.Body>
        <FocusModal.Footer>
          <FocusModal.Close asChild>
            <Button size="small" variant="secondary">
              Cancel
            </Button>
          </FocusModal.Close>
          <Button
            type="submit"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={
              isEditTemplatePending ||
              isTemplatesLoading
            } 
            isLoading={
              isEditTemplatePending ||
              isTemplatesLoading
            }
          >
            {buttonText}
          </Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}
