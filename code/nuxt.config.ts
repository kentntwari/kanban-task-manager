// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ['trpc-nuxt']
  },
  typescript: {
    typeCheck: true,
    strict: true
  },
  modules: ["@nuxtjs/tailwindcss", "@vee-validate/nuxt"],
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    }
  }
})