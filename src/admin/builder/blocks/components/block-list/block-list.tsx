export const BlockList = (props: any) => {
  return (
    <div className="flex flex-col gap-2 divide-y divide-ui-border-base divide-solid">
      {props.children}
    </div>
  )
}
