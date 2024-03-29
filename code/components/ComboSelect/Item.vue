<script
  setup
  lang="ts"
>
import type { ComboboxItemProps } from 'radix-vue'

const props = defineProps<ComboboxItemProps>()
</script>

<template>
  <ComboboxItem
    v-bind="props"
    class="relative py-2 text-md leading-none cursor-pointer"
  >
    <slot />
  </ComboboxItem>
</template>