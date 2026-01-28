import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons"
import { DropdownMenu, Button, IconButton } from "@medusajs/ui"

export function BlockDropdownMenu({ items, append }: { items: any[], append: (item: any) => void }) {
  const handleAddBlock = (type: string) => {
    append({
      id: `${Date.now()}`,
      virtual: true,
      type: type,
      metadata: {},
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">
          Add block
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map((item) => (
          <DropdownMenu.Item key={item.type} className="gap-x-2" onClick={() => handleAddBlock(item.type)}>
            {item.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}