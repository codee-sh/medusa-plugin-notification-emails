import { Heading } from "@react-email/components";

/**
 * HeadingBlock - Heading block component
 *
 */
export function HeadingBlock({
  id,
  props,
  data,
}: {
  id?: string;
  props: any;
  data?: any;
}) {
  return (
    <Heading className="text-xl text-center font-bold mb-4">
      {props.value}
    </Heading>
  );
}
