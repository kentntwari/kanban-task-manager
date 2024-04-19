<script
  setup
  lang="ts"
>
const props = defineProps<{
  prompts?: string[]
}>()

const isCollapsed = defineModel<boolean>('collapsed')

const prompt = ref(null)

onClickOutside(prompt, ()=>{
  if(isCollapsed.value === true){
    isCollapsed.value = false
  }
})
</script>

<template>
  <CollapsibleRoot
    ref="prompt"
    class="relative"
    v-model:open="isCollapsed"
  >
    <CollapsibleTrigger>
      <slot name="trigger"></slot>
    </CollapsibleTrigger>

    <ClientOnly>
      <CollapsibleContent
        class="absolute top-10 right-0 p-4 min-w-48 bg-white dark:bg-very-dark-grey group:text-md rounded-lg shadow-lg"
      >
        <slot
          name="prompts"
          :data="props.prompts"
        ></slot>
      </CollapsibleContent>
    </ClientOnly>
    <slot></slot>
  </CollapsibleRoot>
</template>
