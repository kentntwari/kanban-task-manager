<script
  setup
  lang="ts"
>
const {refresh} = useBoards()

const prompt = ref(null)
const open = ref(false)

onClickOutside(prompt, ()=>{
  if(open.value === true){
    open.value = false
  }
})

const {deleteBoardFn, editBoardFn, isDeleteBoard } = useFormUtils()

const { isRevealed:isModalOpen, reveal:openModalFn,cancel:closeModalFn } = useConfirmDialog()
</script>

<template>
  <CollapsibleRoot
    ref="prompt"
    class="relative"
    v-model:open="open"
  >
    <Modal
      v-model:open="isModalOpen"
      @interact-outside="closeModalFn()"
    >
      <FormDeleteBoard
        v-show="isDeleteBoard"
        @cancel="closeModalFn()"
        @delete="async ()=> {
          refresh()
          closeModalFn()
          await navigateTo('/')
          }"
      />
    </Modal>

    <CollapsibleTrigger>
      <slot></slot>
    </CollapsibleTrigger>

    <ClientOnly>
      <CollapsibleContent
        class="absolute top-10 right-0 p-4 min-w-48 bg-white group:text-md rounded-lg shadow-lg"
      >
        <div class="flex flex-col gap-4">
          <button
            type="button"
            @click="event =>{
              editBoardFn()
              open=false
          }"
          >Edit Board</button>

          <button
            type="button"
            class="text-red"
            @click="event =>{
              openModalFn()
              deleteBoardFn()
              open=false
            }"
          >Delete Board</button>
        </div>

      </CollapsibleContent>
    </ClientOnly>
  </CollapsibleRoot>
</template>
