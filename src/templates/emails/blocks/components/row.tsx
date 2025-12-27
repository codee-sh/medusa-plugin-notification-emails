import { Row, Column } from "@react-email/components";

/**
 * RowBlock - Row block component
 *
 */
export function RowBlock({
  id,
  props,
  data,
  isLastBlock,
  isFirstBlock,
}: {
  id?: string;
  props: any;
  data?: any;
  isLastBlock: boolean;
  isFirstBlock: boolean;
}) {
  return (
    <Row>
      <Column className="font-semibold">{props.label}</Column>
      <Column className="text-right">
        {typeof props.value === "string" ? <span dangerouslySetInnerHTML={{ __html: props.value }} /> : props.value}
      </Column>
    </Row>
  );
}
