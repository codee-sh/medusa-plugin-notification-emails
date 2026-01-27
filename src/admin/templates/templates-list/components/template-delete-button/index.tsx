import { Button, usePrompt, toast } from "@medusajs/ui"
import { useQueryClient } from "@tanstack/react-query"
import { useDeleteTemplate } from "../../../../../hooks/api/templates"
import { Trash } from "@medusajs/icons"

export const TemplateDeleteButton = ({
  id,
}: {
  id: string
}) => {
  const queryClient = useQueryClient()
  const prompt = usePrompt()

  const { mutate: deleteTemplate } = useDeleteTemplate()

  const handleDelete = async () => {
    await deleteTemplate(
      { id: id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["templates"],
          })
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  const handleDeleteConfirmation = async () => {
    const result = await prompt({
      title:
        "Are you sure you want to delete this template?",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    })

    if (result) {
      handleDelete()
    }
  }

  return (
    <Button
      size="small"
      variant="primary"
      onClick={handleDeleteConfirmation}
    >
      <Trash className="w-4 h-4" />
    </Button>
  )
}
