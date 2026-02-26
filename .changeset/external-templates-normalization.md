---
"@codee-sh/medusa-plugin-notification-emails": patch
---

Normalize external template registration to use a single shape
(`templateBlocks` + `translations`) and ensure `getConfig` is
always available for external templates.
