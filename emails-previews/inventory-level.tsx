import { defaultTheme } from "../src/templates/shared/theme";
import { EmailTemplateService } from "../src/modules/mpn-builder/services-local/email-template-service";

export const inventoryLevelMockData: any = {
  inventory_level: {
    id: "inventory_123",
    location_id: "loc_456",
    stocked_quantity: "100",
    reserved_quantity: "20",
    available_quantity: "80",
  },
};

export default function InventoryLevel() {
  const renderTemplate = new EmailTemplateService().renderSync({
    templateName: "inventory-level",
    data: inventoryLevelMockData,
    options: {
      locale: "pl",
      theme: defaultTheme,
    }
  });

  return renderTemplate.reactNode;
}

