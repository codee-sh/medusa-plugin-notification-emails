import { Row, Column } from "@react-email/components";

/**
 * RowBlock - Row block component
 *
 */
export function RowBlock({
  id,
  props,
  data,
}: {
  id?: string;
  props: any;
  data?: any;
}) {
  return (
    <Row>
      <Column className="font-semibold">{props.label}</Column>
      <Column className="text-right">{props.value}</Column>
    </Row>
  );
}
