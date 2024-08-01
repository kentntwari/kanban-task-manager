export default defineNuxtRouteMiddleware((to, from) => {
  if (!useNuxtApp().$auth.loggedIn) {
    return navigateTo("/unsigned", { external: true });
  }
});
