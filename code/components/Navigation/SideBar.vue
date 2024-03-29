<script
  lang="ts"
  setup
>
const isMobileAsideOpen = useState('is-mobile-aside-open', ()=> ref(false))

const {data:boards}=useBoards()

const boardMenu = ref(null)

onClickOutside(boardMenu, () =>{
  if(isMobileAsideOpen.value === true){
    isMobileAsideOpen.value = false
  }
})

</script>

<template>
  <aside
    v-show="isMobileAsideOpen"
    class="[grid-area:1/1] fixed left-1/2 -translate-x-1/2 z-30 mt-20 bg-white w-3/4 max-w-[264px] h-fit py-4 space-y-5 rounded-lg"
  >
    <span class="block uppercase text-sm tracking-[2.4px] px-6">
      All Boards ({{boards?.length}})
    </span>
    <BoardMenu ref="boardMenu" />
  </aside>
</template>
