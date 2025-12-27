import { Section } from "@react-email/components";
import { BlockRenderer } from "../index";

/**
 * SectionBlock - Container for other blocks with optional title and styles
 * 
 */
export function SectionBlock({
  id,
  props,
  data,
  isLastBlock,
  isFirstBlock,
}: { id?: string; props: any; data?: any; isLastBlock: boolean; isFirstBlock: boolean }) {
  return (
    <Section className="m-0 p-0">
      <BlockRenderer blocks={props.blocks || []} data={data} />
    </Section>
  );
}
