import React from "react";
import { SlackBlockRenderer } from "../blocks";

/**
 * Render blocks configuration to SlackBlock[] format
 * 
 * @param data - Template data
 * @param options - Template options (includes blocks configuration)
 * @returns SlackBlock[] array ready for Slack API
 */
export async function renderBlocks(
  data: any,
  options: any
): Promise<any[]> {
  const blocks = options.blocks || [];
  
  // Render block configuration to SlackBlock[] format
  // Blocks are already interpolated in props (by interpolateBlocks)
  // But we also interpolate after rendering (by interpolateSlackBlocks) to handle
  // any text that might be in the Slack API structure
  const slackBlocks = SlackBlockRenderer({
    blocks: blocks,
    data: data,
  });

  return slackBlocks;
}
