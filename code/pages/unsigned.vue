<script lang="ts" setup>
  import { IKImage } from "imagekitio-vue";

  definePageMeta({
    layout: "unsigned",
  });
</script>

<template>
  <header
    class="px-6 py-2 bg-transparent w-full h-16 min-[744px]:h-20 border border-[#241980] rounded-full"
  >
    <nav class="w-full h-full flex justify-between items-center">
      <button
        type="button"
        title="back to home"
        @click="navigateTo('/')"
        class="w-6 min-[744px]:w-10 h-6 min-[744px]:h-10 overflow-hidden"
      >
        <SvgLogo size="lg" /></button
      ><LoginLink
        to="/api/login"
        external
        class="block uppercase text-[16px] min-[744px]:text-[24px] text-[#241980] tracking-wider"
      >
        Sign in
      </LoginLink>
    </nav>
  </header>
  <main
    class="flex-1 w-full max-h-[612px] min-[744px]:max-h-full min-[1024px]:max-h-[688px] min-[744px]:grid min-[1024px]:grid-cols-2 min-[744px]:grid-rows-2 min-[1024px]:grid-rows-1 gap-3 min-[744px]:gap-5"
  >
    <div
      class="w-full h-full px-6 py-8 bg-[#CAC4FD] flex flex-col justify-between rounded-[40px] border border-[#241980]"
    >
      <h1
        class="font-bold text-[40px] min-[744px]:text-[72px] text-[#241980] text-balance leading-[120%] tracking-[-0.03em]"
      >
        Organize your stuff more easily Kanban style
      </h1>
      <div
        class="flex items-center gap-1 cursor-pointer"
        @click="
          !$auth.loggedIn
            ? navigateTo('/api/login', {
                external: true,
              })
            : navigateTo('/')
        "
      >
        <button
          class="w-[227px] min-[744px]:w-[256px] h-[72px] min-[744px]:h-[96px] text-[16px] min-[744px]:text-[24px] text-[#241980] tracking-wider min-[744px]:leading-[32px] rounded-full border border-[#241980]"
          aria-label="Get started"
        >
          GET STARTED
        </button>
        <button
          class="w-[72px] min-[744px]:w-[96px] h-[72px] min-[744px]:h-[96px] flex items-center justify-center text-[16px] text-[#241980] tracking-wider rounded-full border border-[#241980]"
          aria-label="Get started"
        >
          <SvgIcons icon="arrow-up-right" size="sm" />
        </button>
      </div>
    </div>
    <div
      class="hidden min-[744px]:block w-full h-full bg-red rounded-[40px] overflow-hidden border border-[#241980]"
    >
      <IKImage
        urlEndpoint="https://ik.imagekit.io/2rtor9l9w"
        path="/kanban/dashboard.jpg"
        :transformation="[
          {
            width: '0.7',
            crop: 'at_max',
            format: 'webp',
          },
        ]"
        :lqip="{ active: true }"
        loading="lazy"
        class="relative top-32 min-[1024px]:top-44 lg:top-32 xl:top-28 left-72 min-[1024px]:left-52 lg:left-40 xl:left-64 scale-[190%] min-[1024px]:scale-[200%] lg:scale-[175%]"
      />
    </div>
  </main>

  <footer
    class="mt-7 min-[1024px]:mt-[60px] max-w-[212px] min-[744px]:max-w-full mx-auto text-center text-[16px] min-[744px]:text-[22px] text-[#241980]"
  >
    Built with
    <NuxtLink to="https://nuxt.com" class="underline" external>Nuxt</NuxtLink>
    and
    <NuxtLink to="https://neon.tech" class="underline" external
      >Neon DB</NuxtLink
    >
    by
    <NuxtLink to="https://github.com/kentntwari" class="underline" external
      >Kent Ntwari</NuxtLink
    >
  </footer>
</template>
