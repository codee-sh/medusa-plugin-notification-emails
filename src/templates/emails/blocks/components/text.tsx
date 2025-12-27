import { Text } from "@react-email/components";
import { clx } from "@medusajs/ui";

/**
 * TextBlock - Text block component
 * 
 */
export function TextBlock({
  id,
  props,
  isLastBlock,
  isFirstBlock,
}: { id: string, props: any, isLastBlock: boolean, isFirstBlock: boolean }) {
  const className = clx(
    isLastBlock ? "mb-0" : "mb-4",
    isFirstBlock && "mt-0"
  );

  return (
    <Text key={id} className={className}>
      {typeof props.value === "string" ? <span dangerouslySetInnerHTML={{ __html: props.value }} /> : props.value}
    </Text>
  );
}
