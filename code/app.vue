<script
  setup
  lang="ts"
>
import type { BoardTasks } from './types';

const { $client } = useNuxtApp()

const { data, refresh } = useAsyncData('boards', () => $client.getBoardNames.query())

const {data:currentBoardTasks} = useNuxtData<BoardTasks>('current-board-tasks')

const route = useRoute()
const router = useRouter()

const {isFormBoardOpen,isFormModalOpen,shouldAddNewColumn, shouldAddNewBoard, toggleNewBoardUI} = useFormUtils()

const navigation = ref(null)
const isMobileAsideOpen = ref(false)
const shouldPreventAddingNewTasks = ref(true)


onMounted(()=> {
  if(currentBoardTasks.value?.columns !== undefined && currentBoardTasks.value?.columns.length > 0) {
    shouldPreventAddingNewTasks.value = false
  } else {
    shouldPreventAddingNewTasks.value = true
  }
})

onClickOutside(navigation, () =>{
  if(isMobileAsideOpen.value === true){
    isMobileAsideOpen.value = false
  }
})
</script>

<template>
  <NuxtLoadingIndicator />

  <Modal v-model:open="isFormModalOpen">
    <FormBoard
      v-if="isFormBoardOpen"
      @created="(id, name) =>{
      refresh()
      isFormModalOpen = false
      // todo: Having to push data doesn't seem to be proper. Condidering the refresh up top, shouldn't it be done automatically by itself?
      if(id && shouldAddNewBoard) data?.push({id, name})
      return router.push(`/${name}`)
      }"
      @edited="(id)=>{
        isFormModalOpen=false
      }"
    >
      <template #title>
        <h2 class="text-lg text-black">
          <span v-show="shouldAddNewBoard">Add New Board</span>
          <span v-show="shouldAddNewColumn">Edit Board</span>
        </h2>
      </template>
    </FormBoard>
  </Modal>

  <div
    class="grid grid-col-1 after:content-[''] after:w-full after:h-full after:top-0 after:left-0 after:bg-black/50"
    :class="[isMobileAsideOpen ? 'after:fixed' : 'after:hidden']"
  >
    <aside
      v-show="isMobileAsideOpen"
      class="[grid-area:1/1] fixed left-1/2 -translate-x-1/2 z-30 mt-20 bg-white w-3/4 max-w-[264px] h-fit py-4 space-y-5 rounded-lg"
    >
      <span class="block uppercase text-sm tracking-[2.4px] px-6">
        All Boards ({{data?.length}})
      </span>
      <nav
        ref="navigation"
        class="w-full"
      >
        <NuxtLink
          v-for="(board,index) in data"
          class="max-w-60 h-12 px-6 flex items-center gap-3 text-lg rounded-r-full"
          :class="[route.params.board === board.name || (route.path === '/' && index === 0) ? 'bg-main-purple text-white fill-white' : 'fill-medium-grey']"
          :to="{path: board.name}"
          @click="isMobileAsideOpen = false"
        >
          <SvgIcons icon="board"></SvgIcons>

          {{board.name}}
        </NuxtLink>
        <button
          type="button"
          class="max-w-60 h-12 px-6 flex items-center gap-3 text-lg text-main-purple fill-main-purple rounded-r-full"
          @click="event => {
            toggleNewBoardUI()
            if(isMobileAsideOpen) isMobileAsideOpen=false
            }"
        >
          <SvgIcons icon="board"></SvgIcons>
          + Create New Board
        </button>
      </nav>
    </aside>


    <div class="[grid-area:1/1] container min-h-screen flex flex-col">
      <header
        class="fixed top-0 z-30 bg-white w-full h-16 px-4 flex items-center justify-between"
      >
        <section class="flex items-center gap-4">
          <NuxtLink to="/">
            <SvgLogo size="sm" />
          </NuxtLink>
          <div class="relative flex items-center gap-2">
            <h3 class="text-xl text-black">
              {{ route.path === '/' ? data?.at(0)?.name : route.params.board}}
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
            :disabled="shouldPreventAddingNewTasks"
          >
            <SvgIcons icon="plus" />
          </button>

          <button type="button">
            <SvgIcons icon="dots" />
          </button>
        </div>
      </header>

      <main
        class="mt-20 flex-1 px-4 py-6"
        :class="shouldPreventAddingNewTasks ? 'w-screen' : 'w-max'"
      >
        <NuxtPage />
      </main>
    </div>
  </div>
</template>
