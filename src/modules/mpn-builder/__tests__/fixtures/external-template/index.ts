import en from "./translations/en.json"

export const translations = { en }

export const templateBlocks = [
  {
    id: "title",
    type: "heading",
    props: { value: "{{translations.headerTitle}}" },
  },
]
