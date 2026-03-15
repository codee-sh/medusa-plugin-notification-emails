import { Controller } from "react-hook-form"
import {
  FormField,
  TextField,
  TextAreaField,
  NumberField,
  SelectField,
  CheckboxField,
} from "./components"
import { ChipInput } from "../inputs/chip-input"
import { FieldConfig } from "../../../modules/mpn-builder/types/types"
import { DeclarativeFieldManagerProps } from "./types/interfaces"
import { MentionSuggestion } from "./components"

const DEFAULT_MENTION_SUGGESTIONS: MentionSuggestion[] = [
  {
    id: "{{data.order.transformed.order_number}}",
    display: "data.order.transformed.order_number",
  },
  {
    id: "{{data.order.transformed.order_date}}",
    display: "data.order.transformed.order_date",
  },
  {
    id: "{{data.order.transformed.summary.total}}",
    display: "data.order.transformed.summary.total",
  },
  {
    id: "{{data.order.customer.email}}",
    display: "data.order.customer.email",
  },
  {
    id: "{{data.order.sales_channel.name}}",
    display: "data.order.sales_channel.name",
  },
  {
    id: "{{translations.headerTitle}}",
    display: "translations.headerTitle",
  },
]

export const ManagerFields = ({
  fields,
  name,
  form,
  errors,
  mentionSuggestions,
}: DeclarativeFieldManagerProps) => {
  const tokenSuggestions =
    mentionSuggestions && mentionSuggestions.length > 0
      ? mentionSuggestions
      : DEFAULT_MENTION_SUGGESTIONS

  const renderField = (groupField: FieldConfig) => {
    switch (groupField.type) {
      case "text":
        return (
          <Controller
            key={groupField.name || groupField.key}
            name={`${name}.${groupField.name}` as any}
            control={form.control}
            defaultValue={groupField.defaultValue || ""}
            shouldUnregister={false}
            render={({ field, fieldState }) => {
              return (
                <FormField
                  label={groupField.label}
                  required={groupField.required}
                >
                  <TextField
                    label={groupField.label}
                    value={field.value || ""}
                    onChange={(value) =>
                      field.onChange(value)
                    }
                    placeholder={groupField.placeholder}
                    required={groupField.required}
                    mentionSuggestions={tokenSuggestions}
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                  {errors?.[groupField.name] &&
                    !fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {errors[groupField.name]}
                      </span>
                    )}
                </FormField>
              )
            }}
          />
        )
      case "email":
        return (
          <Controller
            key={groupField.name || groupField.key}
            name={`${name}.${groupField.name}` as any}
            control={form.control}
            defaultValue={groupField.defaultValue || ""}
            shouldUnregister={false}
            render={({ field, fieldState }) => {
              return (
                <FormField
                  label={groupField.label}
                  required={groupField.required}
                >
                  <TextField
                    label={groupField.label}
                    value={field.value || ""}
                    onChange={(value) =>
                      field.onChange(value)
                    }
                    placeholder={groupField.placeholder}
                    required={groupField.required}
                    mentionSuggestions={tokenSuggestions}
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                  {errors?.[groupField.name] &&
                    !fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {errors[groupField.name]}
                      </span>
                    )}
                </FormField>
              )
            }}
          />
        )
      case "textarea":
        return (
          <Controller
            key={groupField.name || groupField.key}
            name={`${name}.${groupField.name}` as any}
            control={form.control}
            defaultValue=""
            shouldUnregister={false}
            render={({ field, fieldState }) => {
              return (
                <FormField
                  label={groupField.label}
                  required={groupField.required}
                >
                  <TextAreaField
                    label={groupField.label}
                    value={field.value || ""}
                    onChange={(value) =>
                      field.onChange(value)
                    }
                    placeholder={groupField.placeholder}
                    required={groupField.required}
                    mentionSuggestions={tokenSuggestions}
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                  {errors?.[groupField.name] &&
                    !fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {errors[groupField.name]}
                      </span>
                    )}
                </FormField>
              )
            }}
          />
        )
      case "number":
        return (
          <Controller
            key={groupField.name || groupField.key}
            name={`${name}.${groupField.name}` as any}
            control={form.control}
            defaultValue={groupField.defaultValue || 0}
            shouldUnregister={false}
            render={({ field, fieldState }) => {
              return (
                <FormField
                  label={groupField.label}
                  required={groupField.required}
                >
                  <NumberField
                    label={groupField.label}
                    value={field.value || 0}
                    onChange={(value) =>
                      field.onChange(value)
                    }
                    placeholder={groupField.placeholder}
                    required={groupField.required}
                    min={groupField.min || null}
                    max={groupField.max || null}
                    step={groupField.step || null}
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                  {errors?.[groupField.name] &&
                    !fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {errors[groupField.name]}
                      </span>
                    )}
                </FormField>
              )
            }}
          />
        )
      case "select":
        return (
          <Controller
            key={groupField.name || groupField.key}
            name={`${name}.${groupField.name}` as any}
            control={form.control}
            defaultValue={groupField.defaultValue || ""}
            shouldUnregister={false}
            render={({ field, fieldState }) => {
              return (
                <FormField
                  label={groupField.label}
                  required={groupField.required}
                >
                  <SelectField
                    label={groupField.label}
                    value={field.value || ""}
                    onChange={(value) =>
                      field.onChange(value)
                    }
                    options={groupField.options || []}
                    required={groupField.required}
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                  {errors?.[groupField.name] &&
                    !fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {errors[groupField.name]}
                      </span>
                    )}
                </FormField>
              )
            }}
          />
        )
      case "chip-input": // The component copied from Medusa.js Core.
        return (
          <Controller
            key={groupField.name || groupField.key}
            name={`${name}.${groupField.name}` as any}
            control={form.control}
            defaultValue={groupField.defaultValue || false}
            shouldUnregister={false}
            render={({ field, fieldState }) => {
              return (
                <FormField
                  label={groupField.label}
                  required={groupField.required}
                >
                  <ChipInput
                    name={groupField.name}
                    value={(field.value as string[]) || []}
                    onChange={(value) =>
                      field.onChange(value as string[])
                    }
                    placeholder={groupField.placeholder}
                    allowDuplicates={false}
                    showRemove={true}
                    variant="base"
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                  {errors?.[groupField.name] &&
                    !fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {errors[groupField.name]}
                      </span>
                    )}
                </FormField>
              )
            }}
          />
        )
      case "checkbox":
        return (
          <Controller
            key={groupField.name || groupField.key}
            name={`${name}.${groupField.name}` as any}
            control={form.control}
            defaultValue={groupField.defaultValue || false}
            shouldUnregister={false}
            render={({ field, fieldState }) => {
              return (
                <FormField
                  label={groupField.label}
                  required={groupField.required}
                >
                  <CheckboxField
                    label={groupField.label}
                    checked={field.value || false}
                    onChange={(checked) =>
                      field.onChange(checked)
                    }
                    required={groupField.required}
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </span>
                  )}
                  {errors?.[groupField.name] &&
                    !fieldState.error && (
                      <span className="text-red-500 text-sm">
                        {errors[groupField.name]}
                      </span>
                    )}
                </FormField>
              )
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div key={field.key}>{renderField(field)}</div>
      ))}
    </div>
  )
}
