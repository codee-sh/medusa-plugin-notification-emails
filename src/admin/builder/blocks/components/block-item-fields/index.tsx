import { ManagerFields } from "../../../../components/manager-fields"
import { resolveBlockDefinition } from "../../utils/block-ui-resolver"

export function BlockItemFields(props) {
  const { index, form, blocks, field, path } = props
  const definition = resolveBlockDefinition(
    blocks,
    field.type
  )
  const fields = definition?.fields || []

  const fieldsPathMetadata = `${path}.metadata`

  return (
    <>
      <ManagerFields
        name={fieldsPathMetadata}
        form={form}
        fields={fields}
        errors={
          form.formState.errors?.items?.[index]
            ?.metadata as Record<string, string> | undefined
        }
      />
    </>
  )
}
