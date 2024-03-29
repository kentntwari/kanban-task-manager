<script
  setup
  lang="ts"
>
const {isCanAddTask} = useAddTask()

const isMobileAsideOpen = useState('is-mobile-aside-open')

const { isEditBoard, shouldRefetchBoardData} = useFormUtils()
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
          v-model:open="isEditBoard"
          @interact-outside="isEditBoard = false"
        >
          <FormBoard
            v-show="isEditBoard"
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
        </Modal>
      </main>
    </div>
  </div>
</template>
