<script lang="ts" setup>
  const route = useRoute();

  const { data: boards } = useBoards();

  const isMobileAsideOpen = useState("is-mobile-aside-open");

  const { addNewBoardFn } = useFormUtils();
</script>

<template>
  <span v-show="boards" class="block uppercase text-sm tracking-[2.4px] px-6">
    All Boards ({{ boards?.length }})
  </span>

  <ul class="w-full" role="navigation">
    <li v-for="(board, index) in boards" :key="board.id">
      <NuxtLink
        class="w-11/12 h-12 px-6 flex items-center gap-3 text-lg truncate rounded-r-full"
        :class="[
          route.params.board === board.name ||
          (route.path === '/' && index === 0)
            ? 'bg-main-purple text-white fill-white'
            : 'fill-medium-grey hover:bg-white hover:text-main-purple',
        ]"
        :to="{ path: board.name }"
        @click="isMobileAsideOpen = false"
      >
        <SvgIcons icon="board"></SvgIcons>

        {{ board.name }}
      </NuxtLink>
    </li>

    <button
      type="button"
      title="create new board"
      class="max-w-60 h-12 px-6 flex items-center gap-3 text-lg text-main-purple fill-main-purple rounded-r-full"
      @click="
        (event) => {
          addNewBoardFn();
          if (isMobileAsideOpen) isMobileAsideOpen = false;
        }
      "
    >
      <SvgIcons icon="board"></SvgIcons>
      + Create New Board
    </button>
  </ul>
</template>
