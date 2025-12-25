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
      {props.value}
    </Text>
  );
}
