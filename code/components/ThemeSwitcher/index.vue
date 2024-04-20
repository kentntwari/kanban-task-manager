<script lang="ts" setup>
  const colorMode = useColorMode();

  const toggleColorMode = () => {
    if (colorMode.value === "light") colorMode.preference = "dark";
    if (colorMode.value === "dark") colorMode.preference = "light";
  };
</script>

<template>
  <div class="px-6">
    <div
      class="h-12 w-full bg-light-grey dark:bg-very-dark-grey flex justify-center items-center gap-6 rounded-md"
    >
      <SvgIcons icon="sun" />

      <button
        type="button"
        title="toggle color mode"
        class="flex items-center w-10 h-5 px-1 bg-main-purple hover:bg-dim-purple rounded-full"
        :class="[
          $colorMode.value === 'light' ? 'justify-start' : 'justify-end',
        ]"
        @click="toggleColorMode()"
      >
        <ColorScheme>
          <div class="w-[14px] h-[14px] bg-white rounded-full"></div
        ></ColorScheme>
      </button>

      <SvgIcons icon="moon" />
    </div>
  </div>
</template>
