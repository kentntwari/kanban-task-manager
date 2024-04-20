<script lang="ts" setup>
  const isMobileAsideOpen = useState("is-mobile-aside-open", () => ref(false));
  const isSidebarToggled = useState("is-sidebar-toggled", () => ref(false));

  const { width } = useWindowSize();

  const { data: boards } = useBoards();

  const emit = defineEmits<{
    toggled: [boolean];
  }>();

  const boardMenu = ref(null);

  onClickOutside(boardMenu, () => {
    if (isMobileAsideOpen.value === true) {
      isMobileAsideOpen.value = false;
    }
  });
</script>

<template>
  <aside
    v-show="width < 768 && isMobileAsideOpen"
    class="[grid-area:1/1] fixed left-1/2 -translate-x-1/2 z-30 mt-20 bg-white dark:bg-dark-grey w-3/4 max-w-[264px] h-fit py-4 space-y-5 rounded-lg"
  >
    <span class="block uppercase text-sm tracking-[2.4px] px-6">
      All Boards ({{ boards?.length }})
    </span>
    <BoardMenu ref="boardMenu" />
    <ThemeSwitcher />
  </aside>

  <aside
    v-show="width > 768"
    class="pb-8 col-start-1 bg-white dark:bg-dark-grey"
    :class="[isSidebarToggled ? 'hidden' : 'flex flex-col justify-between']"
  >
    <div class="w-full space-y-3">
      <section class="px-6 h-14 flex items-center">
        <button type="button" title="back to home" @click="navigateTo('/')">
          <SvgLogo size="lg" />
        </button>
      </section>

      <BoardMenu />
    </div>

    <div class="space-y-4">
      <ThemeSwitcher />

      <button
        type="button"
        title="hide sidebar"
        class="group bg-transparent hover:bg-white w-11/12 h-12 px-6 text-lg truncate rounded-r-full"
        @click="
          (event) => {
            isSidebarToggled = !isSidebarToggled;
            emit('toggled', true);
          }
        "
      >
        <div class="group-hover:text-main-purple flex items-center gap-3">
          <SvgIcons icon="eye-closed" />
          <span>Hide Sidebar</span>
        </div>
      </button>
    </div>
  </aside>

  <button
    v-show="isSidebarToggled"
    type="button"
    title="show sidebar"
    class="fixed bottom-8 left-0 bg-main-purple hover:bg-dim-purple w-14 h-12 flex items-center justify-center rounded-tr-full rounded-br-full"
    @click="
      (event) => {
        isSidebarToggled = false;
        emit('toggled', false);
      }
    "
  >
    <SvgIcons icon="eye-open" />
  </button>
</template>
