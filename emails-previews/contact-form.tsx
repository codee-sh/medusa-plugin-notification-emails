import { defaultTheme } from "../src/templates/shared/theme";
import { EmailTemplateService } from "../src/modules/mpn-builder/services-local/email-template-service";

export const contactFormMockData: any = {
  contact_form: {
    name: "Test Name",
    email: "test@test.com",
    phone: "1234567890",
    message: "Test messages",
  }
};

export default function ContactForm() {
  const renderTemplate = new EmailTemplateService().renderSync({
    templateName: "contact-form",
    data: contactFormMockData,
    options: {
      locale: "pl",
      theme: defaultTheme
    }
  });

  return renderTemplate.reactNode;
}
