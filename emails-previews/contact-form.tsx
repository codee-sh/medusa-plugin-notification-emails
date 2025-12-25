import { renderHTMLReact } from "../src/templates/emails/base-template/template";
import { ContactFormTemplateDataType } from "../src/templates/emails/contact-form/types";
import { defaultTheme } from "../src/templates/shared/theme"  
import { getTranslations } from "../src/templates/shared/i18n";

import { translations as contactFormTranslations } from "../src/templates/emails/contact-form/translations";

import {
  createTranslator,
  mergeTranslations,
  interpolate,
} from "../src/utils/i18n"

export const contactFormMockData: any = {
  name: "Test Name",
  email: "test@test.com",
  phone: "1234567890",
  message: "Test messages",
};

export default function ContactForm() {
  const mergedTranslations = mergeTranslations(
    contactFormTranslations,
    {
      pl: {
        headerTitle: "Cześć {{name}}",
      },
      en: {
        headerTitle: "Hello, {{name}}",
      },
    }
  )

  // Create translator function
  const t = createTranslator("pl", mergedTranslations)

  return renderHTMLReact(contactFormMockData, {
    blocks: [
      {
        type: "section",
        props: {
          blocks: [
            {
              type: "text",
              props: {
                text: interpolate("Hello, world! {{name}}", contactFormMockData),
                // text: t("headerTitle", contactFormMockData),
              },
            },
          ],
        },
      },
    ],    
    locale: "pl",
    theme: defaultTheme,
    i18n: getTranslations("pl", contactFormTranslations)
  });
}