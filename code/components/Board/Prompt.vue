<script setup lang="ts">
  const { deleteBoardFn, editBoardFn } = useFormUtils();

  const isCollapsed = ref(false);
</script>

<template>
  <PromptCollapsible v-model:collapsed="isCollapsed">
    <template #trigger>
      <SvgIcons icon="dots" />
    </template>

    <template #prompts>
      <div class="flex flex-col gap-4">
        <button
          type="button"
          @click="
            (event) => {
              editBoardFn();
              isCollapsed = false;
            }
          "
        >
          Edit Board
        </button>

        <button
          type="button"
          class="text-red"
          @click="
            (event) => {
              deleteBoardFn();
              isCollapsed = false;
            }
          "
        >
          Delete Board
        </button>
      </div>
    </template>
  </PromptCollapsible>
</template>
