import React from "react";
import { TemplateOptionsType, TemplateRenderOptionsType, TEMPLATES_NAMES, RenderTemplateParams, RenderTemplateSyncParams } from "./types";
import { EmailTemplateService } from "./email-template-service";
import { TemplateRenderer } from "../shared";

/**
 * Template names constants
 */
export { TEMPLATES_NAMES };

/**
 * Template renderer interface for email channel
 */
export interface EmailTemplateRenderer extends TemplateRenderer {
  getHtml: (data: any, options?: TemplateOptionsType) => Promise<string>;
  getText: (data: any, options?: TemplateOptionsType) => Promise<string>;
  getReactNode?: (data: any, options?: TemplateOptionsType) => any;
}

/**
 * Email template service instance (singleton)
 * Use this to register custom templates or access service methods
 */
export const emailService = new EmailTemplateService();
