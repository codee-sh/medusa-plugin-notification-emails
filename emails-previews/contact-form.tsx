import { defaultTheme } from "../src/templates/shared/theme";
import { renderTemplateSync } from "../src/templates/emails";

export const contactFormMockData: any = {
  name: "Test Name",
  email: "test@test.com",
  phone: "1234567890",
  message: "Test messages",
};

export default function ContactForm() {
  const rawBlocks = [
    {
      type: "section",
      id: "section-1",
      props: {
        blocks: [
          {
            id: "heading-1",
            type: "heading",
            props: {
              value: "{{translations.headerTitle}}",
            },
          },
        ],
      },
    },
    {
      type: "section",
      id: "section-2",
      props: {
        blocks: [
          {
            id: "row-1",
            type: "row",
            props: {
              label: "{{translations.email}}",
              value: "{{data.email}}",
            },
          },
          {
            id: "separator-1",
            type: "separator",
          },
          {
            id: "row-2",
            type: "row",
            props: {
              label: "{{translations.phone}}",
              value: "{{data.phone}}",
            },
          },
          {
            id: "separator-2",
            type: "separator",
          },
          {
            id: "row-3",
            type: "row",
            props: {
              label: "{{translations.message}}",
              value: "{{data.message}}",
            },
          },
        ],
      },
    },
  ];

  const renderTemplate = renderTemplateSync(
    "base-template",
    contactFormMockData,
    {
      blocks: rawBlocks,
      locale: "pl",
      theme: defaultTheme,
      customTranslations: {
        "base-template": {
          pl: {
            headerTitle: "Cześć {{data.name}}",
            email: "Email",
            phone: "Telefon",
            message: "Wiadomość",
          },
        },
      },
    }
  );

  return renderTemplate.reactNode;
}
