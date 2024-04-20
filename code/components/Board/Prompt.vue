<script setup lang="ts">
  const { deleteBoardFn, editBoardFn } = useFormUtils();

  const isCollapsed = ref(false);
</script>

<template>
  <PromptCollapsible v-model:collapsed="isCollapsed">
    <template #trigger>
      <span class="w-5 h-10 flex items-center justify-end">
        <SvgIcons icon="dots" />
      </span>
    </template>

    <template #prompts>
      <div class="flex flex-col gap-4">
        <button
          type="button"
          title="edit board"
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
          title="delete board"
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
