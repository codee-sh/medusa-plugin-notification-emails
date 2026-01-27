import {
  Button,
  FocusModal,
  ProgressTabs,
  toast,
  Heading,
} from "@medusajs/ui"
import { Plus } from "@medusajs/icons"
import { useState, useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import {
  useCreateTemplate,
  useListTemplates,
} from "../../../../hooks/api/templates"
import { TemplatesGeneralForm } from "../templates-general-form"
import {
  TemplateFormValues,
  Tab,
  TabState,
} from "../types"
import { baseTemplateFormSchema } from "../types/schema"

export function TemplatesCreateForm() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>(Tab.GENERAL)
  const [tabState, setTabState] = useState<TabState>({
    [Tab.GENERAL]: "in-progress",
  })
  const [buttonText, setButtonText] = useState<string>("")

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
    extraKey: [],
    enabled: open,
  })

  const {
    mutateAsync: createTemplate,
    isPending: isCreateTemplatePending,
  } = useCreateTemplate()

  // // Create dynamic schema 
  // const templateFormSchema = useMemo(() => {
  //   return baseTemplateFormSchema
  // }, [templatesData?.templates])

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(baseTemplateFormSchema),
    defaultValues: {
      general: {
        name: "",
        label: "",
        description: "",
        channel: "email",
        locale: "en",
        is_active: true
      }
    },
  })

  useEffect(() => {
    if (open === false) {
      form.reset({
        general: {
          name: "",
          label: "",
          description: "",
          channel: "email",
          locale: "en",
          is_active: true,
        }
      })
    }
  }, [open])

  const general = useWatch({
    control: form.control,
    name: "general",
  })

  async function handleSubmit(data: TemplateFormValues) {
    if (Tab.GENERAL === tab) {
      const items = {
        name: data.general.name,
        label: data.general.label,
        description: data.general.description,
        channel: data.general.channel,
        locale: data.general.locale,
        is_active: data.general.is_active,
      }

      await createTemplate({
        items: [items],
      })
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["templates"],
          })
          toast.success("Template created successfully", {
            position: "top-right",
            duration: 3000,
          })
          setOpen(false)
        })
        .catch((error) => {
          toast.error(error.message)
        })
    }
  }

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button size="small" variant="primary">
          <Plus />
        </Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <Heading level="h3" className="shrink-0">
            Create Template
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
            disabled={isCreateTemplatePending}
            isLoading={isCreateTemplatePending}
          >
            {buttonText}
          </Button>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}
