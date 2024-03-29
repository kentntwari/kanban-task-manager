<script
  lang="ts"
  setup
>
const route = useRoute()

const router = useRouter()

const {data:boards, refresh} = useBoards()

const isMobileAsideOpen = useState('is-mobile-aside-open')

const {addNewBoardFn, isAddNewBoard} = useFormUtils()

const { isRevealed:isModalOpen, reveal:openModalFn, cancel:closeModalFn } = useConfirmDialog()
</script>

<template>
  <ul class="w-full">
    <Modal
      v-model:open="isModalOpen"
      @interact-outside="closeModalFn()"
    >
      <FormBoard
        @cancel="closeModalFn()"
        @create="(id, name) =>{
        refresh()
        closeModalFn()
        // todo: Having to push data doesn't seem to be proper. Condidering the refresh up top, shouldn't it be done automatically by itself?
        if(id && isAddNewBoard) boards?.push({id, name})
        return router.push(`/${name}`)
      }"
      >
        <template #title>
          <h2 class="form-title">
            Add New Board
          </h2>
        </template>
      </FormBoard>
    </Modal>

    <li v-for="(board,index) in boards">
      <NuxtLink
        class="max-w-60 h-12 px-6 flex items-center gap-3 text-lg rounded-r-full"
        :class="[route.params.board === board.name || (route.path === '/' && index === 0) ? 'bg-main-purple text-white fill-white' : 'fill-medium-grey']"
        :to="{path: board.name}"
        @click="isMobileAsideOpen = false"
      >
        <SvgIcons icon="board"></SvgIcons>

        {{board.name}}
      </NuxtLink>
    </li>

    <button
      type="button"
      class="max-w-60 h-12 px-6 flex items-center gap-3 text-lg text-main-purple fill-main-purple rounded-r-full"
      @click="event => {
            openModalFn()
            addNewBoardFn()
            if(isMobileAsideOpen) isMobileAsideOpen=false
            }"
    >
      <SvgIcons icon="board"></SvgIcons>
      + Create New Board
    </button>
  </ul>
</template>
