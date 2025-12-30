import { defaultTheme } from "../src/templates/shared/theme";
import { renderTemplateSync } from "../src/templates/emails";

export const contactFormMockData: any = {
  contact_form: {
    name: "Test Name",
    email: "test@test.com",
    phone: "1234567890",
    message: "Test messages",
  }
};

export default function ContactForm() {
  const renderTemplate = renderTemplateSync({
    templateName: "contact-form",
    data: contactFormMockData,
    options: {
      locale: "pl",
      theme: defaultTheme
    }
  });

  return renderTemplate.reactNode;
}
