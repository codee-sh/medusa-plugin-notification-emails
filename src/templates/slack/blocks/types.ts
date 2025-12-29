import { SlackBlock } from "../types"

/**
 * Slack block types based on Slack Block Kit API
 */
export type SlackBlockType = 
  | "header"      // Slack header block
  | "section"     // Slack section block (with fields or text)
  | "actions"    // Slack actions block (with buttons)
  | "divider"    // Slack divider block
  | "text"       // Custom text block (converts to section)
  | "repeater"   // Custom repeater block (iterates over array)

/**
 * Slack block configuration
 */
export type SlackBlockConfig = {
  type: SlackBlockType
  id?: string
  props: SlackBlockProps
}

/**
 * Props for different Slack block types
 */
export type SlackBlockProps = 
  | HeaderBlockProps
  | SectionBlockProps
  | ActionsBlockProps
  | DividerBlockProps
  | TextBlockProps
  | RepeaterBlockProps

/**
 * Header block props
 * Maps to Slack header block: https://api.slack.com/reference/block-kit/blocks#header
 */
export interface HeaderBlockProps {
  text: string              // Header text (will be interpolated)
  emoji?: boolean           // Whether to show emoji (default: true)
}

/**
 * Section block props
 * Maps to Slack section block: https://api.slack.com/reference/block-kit/blocks#section
 */
export interface SectionBlockProps {
  text?: string             // Optional main text (mrkdwn)
  fields?: Array<{          // Optional fields array
    label?: string          // Field label (will be interpolated)
    value?: string          // Field value (will be interpolated)
  }>
}

/**
 * Actions block props
 * Maps to Slack actions block: https://api.slack.com/reference/block-kit/blocks#actions
 */
export interface ActionsBlockProps {
  buttons?: Array<{         // Buttons array
    text: string            // Button text (will be interpolated)
    url?: string            // Button URL (will be interpolated)
    style?: "primary" | "danger" | "default"  // Button style
  }>
}

/**
 * Divider block props
 * Maps to Slack divider block: https://api.slack.com/reference/block-kit/blocks#divider
 */
export interface DividerBlockProps {
  // No props needed for divider
}

/**
 * Text block props (custom - converts to section)
 */
export interface TextBlockProps {
  text: string              // Text content (will be interpolated)
  type?: "plain_text" | "mrkdwn"  // Text type (default: "mrkdwn")
}

/**
 * Repeater block props
 * Iterates over an array and renders blocks for each item
 */
export interface RepeaterBlockProps {
  arrayPath: string         // Path to array in data (e.g., "items", "order.items")
  itemBlocks: SlackBlockConfig[]  // Blocks rendered for each item
  separator?: SlackBlockConfig    // Optional separator between items
}

