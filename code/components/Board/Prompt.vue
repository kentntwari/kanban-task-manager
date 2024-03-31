<script
  setup
  lang="ts"
>
const {refresh} = useBoards()

const {deleteBoardFn, editBoardFn, isDeleteBoard } = useFormUtils()

const isCollapsed=ref(false)
</script>

<template>
  <PromptCollapsible v-model:collapsed="isCollapsed">
    <Modal
      v-model:open="isDeleteBoard"
      @interact-outside="isDeleteBoard = false"
    >
      <FormDeleteBoard
        @cancel="isDeleteBoard = false"
        @delete="async ()=> {
          refresh()
          isDeleteBoard = false
          await navigateTo('/')
          }"
      />
    </Modal>

    <template #trigger>
      <SvgIcons icon="dots" />
    </template>

    <template #prompts>
      <div class="flex flex-col gap-4">
        <button
          type="button"
          @click="event =>{
              editBoardFn()
              isCollapsed = false
          }"
        >Edit Board</button>

        <button
          type="button"
          class="text-red"
          @click="event =>{
              isDeleteBoard = true
              deleteBoardFn()
            }"
        >Delete Board</button>
      </div>
    </template>
  </PromptCollapsible>
</template>
