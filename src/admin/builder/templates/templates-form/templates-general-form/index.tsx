import {
  Input,
  Label,
  Select,
  Checkbox,
  Text,
} from "@medusajs/ui"
import { Controller, useWatch } from "react-hook-form"

export function TemplatesGeneralForm({
  form,
  isOpen,
  isEditMode = false,
}: {
  form: any
  isOpen?: boolean
  isEditMode?: boolean
}) {
  const availableChannels = [
    { value: "email", label: "Email" },
    { value: "slack", label: "Slack" },
  ]
  const availableLocales = [
    { value: "en", label: "English" },
    { value: "pl", label: "Polish" },
  ]

  return (
    <div className="w-full">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="block">
              Name
            </Label>
            <Controller
              name="general.name"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    placeholder="Enter the name of the automation"
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="block">
              Label
            </Label>
            <Controller
              name="general.label"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    placeholder="Enter the label of the template"
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="block">
              Description
            </Label>
            <Controller
              name="general.description"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    placeholder="Enter the description text of the template"
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="channel" className="block">
              Channel
            </Label>
            <Controller
              name="general.channel"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    key={`channel-${availableChannels.length}-${field.value}`}
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Select the channel" />
                    </Select.Trigger>
                    <Select.Content>
                      {availableChannels.map((channel) => (
                        <Select.Item
                          key={channel.value}
                          value={channel.value}
                        >
                          {channel.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div> 
          <div className="flex flex-col gap-2">
            <Label htmlFor="locale" className="block">
              Locale
            </Label>
            <Controller
              name="general.locale"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    key={`locale-${availableLocales.length}-${field.value}`}
                    value={field.value ?? ""}
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Select the locale" />
                    </Select.Trigger>
                    <Select.Content>
                      {availableLocales.map((locale) => (
                        <Select.Item
                          key={locale.value}
                          value={locale.value}
                        >
                          {locale.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="subject" className="block">
              Subject
            </Label>
            <Controller
              name="general.subject"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="Enter the email subject"
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="active" className="block">
              Active
            </Label>
            <div className="flex items-center space-x-2">
              <Controller
                name="general.is_active"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Checkbox
                      checked={field.value || false}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      id="is_active"
                    />
                    <Label
                      htmlFor="is_active"
                      className="text-sm font-medium cursor-pointer"
                    >
                      {field.value ? "Yes" : "No"}
                    </Label>
                    {fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {fieldState.error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
          </div>          
        </div>
      </div>
    </div>
  )
}
