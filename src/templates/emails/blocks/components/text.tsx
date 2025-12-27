import { Text } from "@react-email/components";

/**
 * TextBlock - Text block component
 * 
 */
export function TextBlock({
  id,
  props,
}: { id: string, props: any }) {
  return (
    <Text key={id}>
      {typeof props.value === "string" ? <span dangerouslySetInnerHTML={{ __html: props.value }} /> : props.value}
    </Text>
  );
}
