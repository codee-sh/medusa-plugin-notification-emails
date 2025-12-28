export const TEMPLATES_NAMES = {
  BASE_TEMPLATE: "base-template",
  INVENTORY_LEVEL: "inventory-level",
  ORDER_PLACED: "order-placed",
  ORDER_COMPLETED: "order-completed",
  ORDER_UPDATED: "order-updated",
  CONTACT_FORM: "contact-form",
} as const;

export interface TemplateRenderOptionsType {
  blocks?: any[];
  theme?: any;
  locale?: any;  
  customTranslations?: Record<string, Record<string, any>>;
}

export interface TemplateOptionsType {
  blocks?: any[];
  theme?: any;
  locale?: any;  
  customTranslations?: Record<string, Record<string, any>>;
}
