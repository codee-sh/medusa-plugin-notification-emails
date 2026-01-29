import { ManagerFields } from "../../../../components/manager-fields"

export function BlockItemFields(props) {
  const { index, form, remove, blocks, field, path } = props
  
  const availableBlock = blocks.find((b) => b.type === field.type)
  const fields = availableBlock?.fields || []

  const fieldsPathMetadata = `${path}.metadata`

  return (
    <>
      <ManagerFields
        name={fieldsPathMetadata}
        form={form}
        fields={fields}
        errors={
          form.formState.errors?.items?.[index]?.metadata as
            | Record<string, string>
            | undefined
        }
      />
    </>
  )
}
