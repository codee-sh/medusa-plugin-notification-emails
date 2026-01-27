import {
  errorHandler,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
  authenticate,
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
  maybeApplyLinkFilter,
} from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"
import { z } from "zod"

export const AdminNotificationListParams =
  createFindParams().extend({
    resource_id: z.string().optional(),
    resource_type: z.string().optional(),
  })

export const AdminTemplateListParams =
  createFindParams().extend({
    id: z.string().optional(),
  })

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/mpn/templates",
      methods: ["GET"],
      middlewares: [
        authenticate("user", ["session", "bearer"], {
          allowUnauthenticated: false,
        }),
        validateAndTransformQuery(
          AdminTemplateListParams,
          {
            defaults: [
              "id",
              "name",
              "label",
              "description",
              "created_at",
              "updated_at",
              "channel",
              "locale",
              "is_active",
              "blocks",
            ],
            isList: true,
          }
        ),
      ],
    },
    {
      matcher: "/admin/mpn/notifications",
      methods: ["GET"],
      middlewares: [
        authenticate("user", ["session", "bearer"], {
          allowUnauthenticated: false,
        }),
        validateAndTransformQuery(
          AdminNotificationListParams,
          {
            defaults: [
              "id",
              "to",
              "channel",
              "created_at",
              "status",
              "template",
              "trigger_type",
              "resource_id",
              "resource_type",
              "receiver_id",
              "original_notification_id",
              "external_id",
              "provider_id",
            ],
            isList: true,
          }
        ),
      ],
    },
  ],
})
