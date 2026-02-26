import { defineConfig } from "@medusajs/framework/utils"

export default defineConfig({
  projectConfig: {
    http: {
      adminCors: "",
      authCors: "",
      storeCors: "",
      jwtSecret: "test",
      cookieSecret: "test",
    },
  },
  modules: {
    mpnBuilder: {
      resolve: "./modules/mpn-builder",
    },
  },
})
