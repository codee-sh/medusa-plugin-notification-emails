import { defaultTheme } from "../src/templates/shared/theme";
import { renderTemplateSync } from "../src/templates/emails";

export const contactFormMockData: any = {
  name: "Test Name",
  email: "test@test.com",
  phone: "1234567890",
  message: "Test messages",
};

export default function ContactForm() {
  const renderTemplate = renderTemplateSync(
    "contact-form",
    contactFormMockData,
    {
      locale: "pl",
      theme: defaultTheme
    }
  );

  return renderTemplate.reactNode;
}
