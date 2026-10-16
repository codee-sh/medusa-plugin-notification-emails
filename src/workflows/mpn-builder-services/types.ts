/**
 * Render options shared by the email and Slack rendering workflows
 */
export type RenderServiceOptions = {
  /**
   * Locale of the translations; "en" when not given
   */
  locale?: string
  theme?: Record<string, any>
  /**
   * Translations merged over the template's own, keyed by locale
   */
  translations?: Record<string, any>
}

/**
 * Input of emailServiceWorkflow
 */
export type EmailServiceWorkflowInput = {
  /**
   * `system_*` or `external_*` for a registered template, any other id for a database template
   */
  template_id: string
  /**
   * Data the template reads through `{{data.*}}` placeholders
   */
  data: Record<string, any>
  options?: RenderServiceOptions & {
    /**
     * Email subject; may hold `{{data.*}}` and `{{translations.*}}` placeholders. Defaults to
     * the template's `{{translations.headerTitle}}`.
     */
    subject?: string
  }
}

/**
 * Output of emailServiceWorkflow
 */
export type EmailServiceWorkflowOutput = {
  html: string
  text: string
  subject: string
}

/**
 * Input of slackServiceWorkflow
 */
export type SlackServiceWorkflowInput = {
  template_id: string
  data: Record<string, any>
  options?: RenderServiceOptions & {
    backendUrl?: string
  }
}
