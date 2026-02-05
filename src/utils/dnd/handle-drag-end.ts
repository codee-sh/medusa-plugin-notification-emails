export function handleDragEnd({
  form,
  path,
  event,
  fields,
  move,
}: {
  form: any
  path: string
  event: any
  fields: any
  move: (oldIndex: number, newIndex: number) => void
}) {
  const { active, over } = event
  if (!over) return
  if (active.id === over.id) return

  const oldIndex = fields.findIndex(
    (f: any) => f.rhf_id === active.id
  )
  const newIndex = fields.findIndex(
    (f: any) => f.rhf_id === over.id
  )

  if (oldIndex === -1 || newIndex === -1) return

  move(oldIndex, newIndex)

  const next = form.getValues(path as any) || []
  next.forEach((_: any, idx: number) => {
    form.setValue(`${path}.${idx}.position` as any, idx, {
      shouldDirty: true,
    })
  })
}
