import { Text, Row, Column } from "@react-email/components"

/**
 * ProductItemBlock - Product item block component
 *
 */
export function ProductItemBlock({
  props,
  data,
  isLastBlock,
  isFirstBlock,
}: {
  id: string
  props: any
  data?: any
  isLastBlock: boolean
  isFirstBlock: boolean
}) {
  return (
    <Row>
      {props.thumbnail && (
        <>
          <Column className="w-[50px]">
            <img
              src={props.thumbnail}
              width={50}
              height={50}
            />
          </Column>
          <Column className="w-[12px]"></Column>
        </>
      )}

      <Column className="text-left">
        {typeof props.value === "string" ? (
          <span
            dangerouslySetInnerHTML={{
              __html: props.value,
            }}
          />
        ) : (
          props.value
        )}
      </Column>
    </Row>
  )
}
