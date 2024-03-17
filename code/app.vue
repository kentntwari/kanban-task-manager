<script setup lang="ts">
const { $client } = useNuxtApp()

const { data } = useAsyncData('boards', () => $client.getBoardNames.query())

const route = useRoute()
</script>

<template>
  <NuxtLoadingIndicator />
  
  <div class="container min-h-screen flex flex-col">
    <header class="bg-white w-full h-16 px-4 fixed top-0 z-10 flex items-center justify-between">
      <section class="flex items-center gap-4">
        <NuxtLink to="/">
          <SvgLogo size="sm" />
        </NuxtLink>
        <div class="flex items-center gap-2">
          <h3 
          class="text-xl text-black ">
          {{ route.path === '/' ? data?.at(0)?.name : route.params.board}}
        </h3>
          <SvgIcons icon="chevron-down" />
        </div>
      </section>

      <div class="flex items-center gap-4">
        <button 
        type="button" 
        class="btn-small-primary min-w-12 disabled:bg-main-purple/25" 
        disabled>
          <SvgIcons icon="plus" />
        </button>
        <SvgIcons icon="dots" />
      </div>
    </header>

    <main class="w-max mt-20 flex-1 relative px-4 py-6">
      <NuxtPage />
    </main>
  </div>
</template>
