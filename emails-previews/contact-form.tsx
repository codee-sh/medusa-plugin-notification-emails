import { defaultTheme } from "../src/templates/shared/theme";
import { EmailTemplateService } from "../src/modules/mpn-builder/services-local/email-template-service";
import { TEMPLATES_NAMES } from "../src/templates/emails/types";

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
    templateName: TEMPLATES_NAMES.CONTACT_FORM,
    data: contactFormMockData,
    options: {
      locale: "pl",
      theme: defaultTheme
    }
  });

  return renderTemplate.reactNode;
}
