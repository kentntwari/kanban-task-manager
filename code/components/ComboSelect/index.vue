<script
  setup
  lang="ts"
>
import {  useForwardPropsEmits } from 'radix-vue'
import type { ComboboxRootEmits, ComboboxRootProps } from 'radix-vue'

interface ExtendedComboboxRootProps extends ComboboxRootProps {
  placeholder?: string;
}

const props = defineProps<ExtendedComboboxRootProps>()
const emits = defineEmits<ComboboxRootEmits>()

const forward = useForwardPropsEmits(props, emits)
</script>

<template>
  <ComboboxRoot
    v-bind="forward"
    class="relative cursor-pointer"
  >
    <ComboboxAnchor
      class="w-full inline-flex items-center justify-between rounded px-4 text-md text-black leading-none h-10 border border-medium-grey/25"
    >
      <ComboboxInput
        class="bg-white/0 outline-none h-full dark:text-white"
        :placeholder="props.placeholder ?? ''"
      />
      <ComboboxTrigger>
        <SvgIcons icon="chevron-down" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent
      class="w-full mt-2 min-w-[160px] bg-white dark:bg-very-dark-grey overflow-hidden rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
    >
      <ComboboxViewport class="p-[5px]">
        <ComboboxEmpty class="text-xs font-medium text-center py-2">
          <slot name="empty">No options</slot>
        </ComboboxEmpty>

        <ComboboxGroup class="p-4">
          <slot name="content"></slot>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>