<script
  setup
  lang="ts"
>
const {refresh} = useBoards()

const {isCanAddTask} = useAddTask()

const isMobileAsideOpen = useState('is-mobile-aside-open')

const { isEditBoard, shouldRefetchBoardData,isEditTask, isDeleteTask} = useFormUtils()

const isModalOpen = computed(()=>{
  if(isEditBoard.value) return true
  if(isDeleteTask.value) return true
  if(isEditTask.value) return true
  return false
})
</script>

<template>
  <NuxtLoadingIndicator />

  <div
    class="grid grid-col-1 after:content-[''] after:w-full after:h-full after:top-0 after:left-0 after:bg-black/50"
    :class="[isMobileAsideOpen ? 'after:fixed' : 'after:hidden']"
  >
    <NavigationSideBar />

    <div class="[grid-area:1/1] container min-h-screen flex flex-col">
      <NavigationTopBar />

      <main
        class="mt-20 flex-1 px-4 py-6"
        :class="isCanAddTask ? 'w-screen' : 'w-max'"
      >
        <NuxtPage />

        <Modal
          v-model:open="isModalOpen"
          @interact-outside="event =>{
            if(isEditBoard) isEditBoard = false
            if(isDeleteTask) isDeleteTask = false
            if(isEditTask) isEditTask = false
      }"
        >
          <FormBoard
            v-if="isEditBoard"
            @cancel="isEditBoard = false"
            @edit="() =>{
              if(isEditBoard) shouldRefetchBoardData = true
              isEditBoard = false
             }"
          >
            <template #title>
              <h2 class="form-title">
                Edit Board
              </h2>
            </template>
          </FormBoard>

          <FormTask
            v-if="isEditTask"
            @cancel="isEditTask = false"
          >
            <template #title>
              <h2 class="form-title">Edit Task</h2>
            </template>
          </FormTask>

          <FormDeleteTask
            v-if="isDeleteTask"
            @cancel="isDeleteTask = false"
            @delete="async ()=> {
              refresh()
              isDeleteTask = false
              await navigateTo('/')
          }"
          />
        </Modal>
      </main>
    </div>
  </div>
</template>
