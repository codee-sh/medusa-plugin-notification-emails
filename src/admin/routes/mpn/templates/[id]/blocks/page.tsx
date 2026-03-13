import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ListBullet } from "@medusajs/icons"
import { Button, Container, Heading } from "@medusajs/ui"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { SingleColumnPage } from "../../../../../components/layout/pages"
import { BlocksContainer } from "../../../../../builder/blocks"
import { BlocksPreviewContainer } from "../../../../../builder/blocks/blocks-preview/blocks-preview-container"

const ListPage = () => {
  const { id } = useParams()
  const [isPreviewVisible, setIsPreviewVisible] =
    useState(false)

  return (
    <SingleColumnPage
      widgets={{
        before: [],
        after: [],
      }}
    >
      <Container>
        <div className="flex justify-between">
          <Heading level="h1">Blocks</Heading>
          <Button
            variant="secondary"
            size="small"
            onClick={() =>
              setIsPreviewVisible((prev) => !prev)
            }
          >
            {isPreviewVisible
              ? "Hide preview"
              : "Show preview"}
          </Button>
        </div>
      </Container>
      <div
        className={`grid grid-cols-1 gap-4 ${
          isPreviewVisible ? "md:grid-cols-2" : ""
        }`}
      >
        <div className="col-span-1">
          <BlocksContainer id={id ?? ""} />
        </div>
        {isPreviewVisible && (
          <div className="col-span-1">
            <BlocksPreviewContainer templateId={id ?? ""} />
          </div>
        )}
      </div>
    </SingleColumnPage>
  )
}

export const config = defineRouteConfig({
  label: "Blocks",
})

export default ListPage
