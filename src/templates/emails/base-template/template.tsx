import React from "react"
import {
  Html,
  Tailwind,
  Head,
  Text,
  Body,
  Container,
  pixelBasedPreset,
  Section,
  Row,
  Column,
  Heading,
  Hr,
} from "@react-email/components"
import { render, pretty } from "@react-email/render"
import { TemplateOptionsType } from "../../../modules/mpn-builder/types/interfaces"
import { BlockRenderer } from "../blocks"

export function renderHTMLReact(
  data: any,
  options: TemplateOptionsType
): React.ReactNode {
  const theme = options.theme || {}
  const blocks = options.blocks || []

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: theme,
        }}
      >
        <Body className="mx-auto my-auto px-4 font-arial font-normal text-base bg-ui-bg text-ui-text">
          <Container className="py-4">
            <BlockRenderer blocks={blocks} data={data} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export async function renderHTML(
  data: any,
  options: TemplateOptionsType
): Promise<any> {
  return await pretty(
    await render(renderHTMLReact(data, options))
  )
}

export async function renderText(
  data: any,
  options: TemplateOptionsType
): Promise<any> {
  // `plainText` instead of `toPlainText`, which @react-email/render 1.1.4 - the version Medusa
  // Cloud supports - does not export
  return await render(renderHTMLReact(data, options), {
    plainText: true,
  })
}
