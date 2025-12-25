import React from "react";
import { Html, Tailwind, Head, Text, Body, Container, pixelBasedPreset, Section, Row, Column, Heading, Hr } from "@react-email/components";
import { render, pretty, toPlainText } from "@react-email/render";
import { TemplateOptionsType } from "../types";
import { BlockRenderer } from "../blocks";

export function renderHTMLReact(
  data: any,
  options: TemplateOptionsType
): React.ReactNode {
  const theme = options.theme || {};
  const blocks = options.blocks || [];

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: theme
        }}
      >
        <Body className="mx-auto my-auto px-4 font-arial font-normal text-base bg-ui-bg text-ui-text">         
          <Container>
            <BlockRenderer blocks={blocks} data={data} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export async function renderHTML(
  data: any,
  options: TemplateOptionsType
): Promise<any> {
  return await pretty(await render(renderHTMLReact(data, options)));
}

export async function renderText(
  data: any,
  options: TemplateOptionsType
): Promise<any> {
  const html = await render(renderHTMLReact(data, options));
  return toPlainText(html);
}

