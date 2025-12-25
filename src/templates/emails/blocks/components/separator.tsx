import { Hr } from "@react-email/components";

/**
 * SeparatorBlock - Separator block component
 *
 */
export function SeparatorBlock({
  id,
  props,
  data,
}: {
  id?: string;
  props: any;
  data?: any;
}) {
  return (
    <Hr className="my-4 border-ui-border" />
  );
}
