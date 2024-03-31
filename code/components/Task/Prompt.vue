<script
  setup
  lang="ts"
>
const emit = defineEmits<{
  promptValidate: [void]
}>()

const {deleteTaskFn, editTaskFn } = useFormUtils()

const isCollapsed = ref(false)
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
          @click="event => {
            emit('promptValidate')
            editTaskFn()
          }"
        >Edit Task</button>

        <button
          type="button"
          class="text-red"
          @click="event => {
            emit('promptValidate')
            deleteTaskFn()
          }"
        >Delete Task</button>
      </div>
    </template>
  </PromptCollapsible>
</template>
