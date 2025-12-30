import { SlackTemplateService } from "../../slack-template-service"
import { TEMPLATES_NAMES } from "../../types"

describe("SlackTemplateService - Inventory Level Template", () => {
  let service: SlackTemplateService

  beforeEach(() => {
    service = new SlackTemplateService()
  })

  describe("Template Registration", () => {
    it("should register inventory-level template", () => {
      const template = service.getTemplate(TEMPLATES_NAMES.INVENTORY_LEVEL)
      expect(template).toBeDefined()
      expect(template.getConfig).toBeDefined()
    })

    it("should return correct config for inventory-level template", () => {
      const template = service.getTemplate(TEMPLATES_NAMES.INVENTORY_LEVEL)
      const config = template.getConfig()
      
      expect(config).toHaveProperty("blocks")
      expect(config).toHaveProperty("translations")
    })
  })

  describe("Template Rendering", () => {
    const mockInventoryLevelData = {
      inventory_level: {
        id: "il_123",
        stocked_quantity: 100,
        reserved_quantity: 10,
        incoming_quantity: 20,
        available_quantity: 90,
        inventory_item: {
          id: "iitem_01K04YSAT05H2Z15CAR3KCHEAR",
          title: "Test Product",
        },
        stock_locations: [
          {
            id: "loc_1",
            name: "Warehouse A",
          },
          {
            id: "loc_2",
            name: "Warehouse B",
          },
        ],
      },
      global: {
        backend_url: "https://admin.example.com",
      },
    }

    it("should render inventory-level template with basic data", async () => {
      const result = await service.render({
        templateName: TEMPLATES_NAMES.INVENTORY_LEVEL,
        data: mockInventoryLevelData,
        options: {
          locale: "en"
        },
      })

      expect(result).toHaveProperty("blocks")
      expect(Array.isArray(result.blocks)).toBe(true)
      expect(result.blocks.length).toBeGreaterThan(0)
    })

    it("should interpolate translation variables in header", async () => {
      const result = await service.render({
        templateName: TEMPLATES_NAMES.INVENTORY_LEVEL,
        data: mockInventoryLevelData,
        options: {
          locale: "en",
        },
      })

      const headerBlock = result.blocks.find((block) => block.type === "header")
      expect(headerBlock).toBeDefined()
      expect(headerBlock.text).toBeDefined()
      expect(headerBlock.text.text).toContain("Test Product")
      expect(headerBlock.text.text).toContain("has been updated")
    })

    it("should interpolate data variables in URL", async () => {
      const result = await service.render({
        templateName: TEMPLATES_NAMES.INVENTORY_LEVEL,
        data: mockInventoryLevelData,
        options: {
          locale: "en"
        },
      })

      const actionsBlock = result.blocks.find((block) => block.type === "actions")
      expect(actionsBlock).toBeDefined()
      expect(actionsBlock.elements).toBeDefined()
      expect(actionsBlock.elements.length).toBeGreaterThan(0)

      const button = actionsBlock.elements[0]
      expect(button.url).toBe(
        "https://admin.example.com/app/inventory/iitem_01K04YSAT05H2Z15CAR3KCHEAR"
      )
    })

    it("should generate fields from fieldsPath when stock_locations exist", async () => {
      const result = await service.render({
        templateName: TEMPLATES_NAMES.INVENTORY_LEVEL,
        data: mockInventoryLevelData,
        options: {
          locale: "en"
        },
      })

      const sectionBlock = result.blocks.find((block) => block.type === "section")
      expect(sectionBlock).toBeDefined()
      expect(sectionBlock.fields).toBeDefined()
      expect(Array.isArray(sectionBlock.fields)).toBe(true)
      expect(sectionBlock.fields.length).toBe(2) // Warehouse A and Warehouse B

      // Check that fieldsPath and fieldTemplate are removed
      expect(sectionBlock.fieldsPath).toBeUndefined()
      expect(sectionBlock.fieldTemplate).toBeUndefined()

      // Check field content
      expect(sectionBlock.fields[0].text).toBe("Warehouse A")
      expect(sectionBlock.fields[1].text).toBe("Warehouse B")
    })

    it("should use translations when provided", async () => {
      const translations = {
        en: {
          header: {
            title: "Custom title: {{data.inventory_level.inventory_item.title}}",
          },
        },
      }

      const result = await service.render({
        templateName: TEMPLATES_NAMES.INVENTORY_LEVEL,
        data: mockInventoryLevelData,
        options: {
          locale: "en",
          translations: translations,
        },
      })

      const headerBlock = result.blocks.find((block) => block.type === "header")
      expect(headerBlock.text.text).toContain("Custom title:")
      expect(headerBlock.text.text).toContain("Test Product")
    })

    it("should remove helper properties (fieldsPath, fieldTemplate) from output", async () => {
      const result = await service.render({
        templateName: TEMPLATES_NAMES.INVENTORY_LEVEL,
        data: mockInventoryLevelData,
        options: {
          locale: "en"
        },
      })

      // Check all blocks for helper properties
      result.blocks.forEach((block) => {
        expect(block.fieldsPath).toBeUndefined()
        expect(block.fieldTemplate).toBeUndefined()
      })
    })
  })

  describe("Error Handling", () => {
    it("should throw error when template name is missing", async () => {
      await expect(
        service.render({
          templateName: null as any,
          data: {},
          options: {},
        })
      ).rejects.toThrow("Template name is required")
    })

    it("should throw error when template does not exist", async () => {
      await expect(
        service.render({
          templateName: "non-existent-template" as any,
          data: {},
          options: {},
        })
      ).rejects.toThrow()
    })
  })
})

