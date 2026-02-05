import { BlocksPreview } from "./blocks-preview"

export const BlocksPreviewGroup = ({ templateId }: { templateId: string }) => {
  return (
    <>
      <BlocksPreview templateId={templateId} />
    </>
  )
}
