<script
  lang="ts"
  setup
>
const {data:boards} = useBoards()

const {isCanAddTask} = useAddTask()

const isMobileAsideOpen = useState('is-mobile-aside-open')

const route = useRoute()

const {shouldRefetchBoardData, isAddNewTask, addNewTaskFn} = useFormUtils()

</script>

<template>
  <header
    class="fixed top-0 z-30 bg-white w-full h-16 px-4 flex items-center justify-between"
  >
    <Modal
      v-model:open="isAddNewTask"
      @interact-outside="isAddNewTask = false"
    >
      <FormTask @create="()=>{
          shouldRefetchBoardData = true
          isAddNewTask = false
    }">
        <template #title>
          <h2 class="form-title">
            Add New Task
          </h2>
        </template>
      </FormTask>
    </Modal>

    <section class="flex items-center gap-4">
      <NuxtLink to="/">
        <SvgLogo size="sm" />
      </NuxtLink>
      <div class="relative flex items-center gap-2">
        <h3 class="text-xl text-black">
          {{ route.path === '/' ? boards?.at(0)?.name : route.params.board}}
        </h3>
        <button
          type="button"
          class="before:absolute before:top-0 before:left-0 before:w-full before:h-full"
          @click="isMobileAsideOpen =!isMobileAsideOpen"
        >
          <SvgIcons icon="chevron-down" />
        </button>
      </div>
    </section>

    <div class="flex items-center gap-4">
      <button
        type="button"
        class="btn-small-primary min-w-12 disabled:bg-main-purple/25"
        :disabled="isCanAddTask"
        @click="event =>{
          isAddNewTask = true
          addNewTaskFn()
          }"
      >
        <SvgIcons icon="plus" />
      </button>
      <BoardPrompt>
        <SvgIcons icon="dots" />
      </BoardPrompt>
    </div>
  </header>
</template>
