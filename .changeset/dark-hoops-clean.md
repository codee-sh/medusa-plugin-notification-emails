---
"@codee-sh/medusa-plugin-notification-emails": patch
---

Fix external template rendering for Slack and Email workflows by treating `external_*` IDs as registry templates instead of DB templates. Update docs to clarify template ID resolution.
