<script setup lang="ts">
  import {
    type DialogContentEmits,
    type DialogContentProps,
    useEmitAsProps,
  } from "radix-vue";

  const open = defineModel<boolean>("open");
  const props = defineProps<DialogContentProps>();
  const emits = defineEmits<DialogContentEmits>();

  const emitsAsProps = useEmitAsProps(emits);
</script>

<template>
  <DialogRoot v-if="open !== undefined" :open="open">
    <DialogPortal>
      <DialogOverlay class="bg-black/20 fixed w-auto inset-0 z-30" />
      <DialogContent
        class="fixed top-[50%] left-[50%] h-1/2 md:h-auto max-h-[85vh] overflow-auto w-11/12 max-w-[450px] md:max-w-[480px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white dark:bg-dark-grey p-6 md:p-8 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
        v-bind="{ ...props, ...emitsAsProps }"
      >
        <VisuallyHidden>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </VisuallyHidden>
        <slot></slot>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
