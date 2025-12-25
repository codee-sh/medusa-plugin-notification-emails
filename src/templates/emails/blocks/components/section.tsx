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
}: { id?: string; props: any; data?: any }) {
  return (
    <Section>
      <BlockRenderer blocks={props.blocks || []} data={data} />
    </Section>
  );
}
