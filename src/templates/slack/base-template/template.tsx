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
  
  const slackBlocks = SlackBlockRenderer({
    blocks: blocks,
    data: data,
  });

  console.log("slackBlocks", slackBlocks);

  return slackBlocks;
}
