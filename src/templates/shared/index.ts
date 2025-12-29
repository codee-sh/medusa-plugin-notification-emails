
// /**
//  * Prepare template data (translations, blocks, translator, processedBlocks)
//  * Shared logic for renderTemplate and renderTemplateSync
//  */
// function prepareTemplateData(
//     templateName: TemplateName,
//     data: TemplateData,
//     interpolateFunction: (...args: any[]) => any,
//     options?: any,
//   ): {
//     template: TemplateRenderer;
//     translator: { t: (key: string, data?: Record<string, any>) => string };
//     processedBlocks: any[];
//     renderOptions: any;
//   } {
//     const locale = options?.locale || "pl";
//     const template = getTemplate(templateName);
//     const config = template.getConfig?.() || {};
  
//     // Get translations for this template
//     const translations = config?.translations || templateTranslationsRegistry[templateName] || {};
  
//     // If blocks are not provided, use basic blocks from config
//     const providedBlocks = options?.blocks || [];
//     let blocks = providedBlocks.length > 0 ? providedBlocks : config?.blocks || [];
  
//     // Process translations once
//     const customTranslations = options?.customTranslations?.[templateName];
  
//     // Merge translations
//     const mergedTranslations = mergeTranslations(
//       translations,
//       customTranslations
//     );
  
//     // Create translator function
//     const translator = createTranslator(locale, mergedTranslations as any);
  
//     // Interpolate blocks if provided
//     const processedBlocks =
//       blocks.length > 0 ? interpolateFunction(blocks, data, translator) : blocks;
  
//     // Pass processed blocks in options to render functions
//     const renderOptions: SlackTemplateOptions = {
//       ...options,
//       blocks: processedBlocks,
//     };
  
//     return {
//       template,
//       translator,
//       processedBlocks,
//       renderOptions,
//     };
//   }
  