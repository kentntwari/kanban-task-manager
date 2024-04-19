<script lang="ts" setup>
  const isMobileAsideOpen = useState("is-mobile-aside-open", () => ref(false));
  const isSidebarToggled = useState("is-sidebar-toggled", () => ref(false));

  const { width } = useWindowSize();

  const { data: boards } = useBoards();

  const colorMode = useColorMode();

  const emit = defineEmits<{
    toggled: [boolean];
  }>();

  const boardMenu = ref(null);

  const toggleColorMode = () => {
    if (colorMode.value === "light") colorMode.preference = "dark";
    if (colorMode.value === "dark") colorMode.preference = "light";
  };

  onClickOutside(boardMenu, () => {
    if (isMobileAsideOpen.value === true) {
      isMobileAsideOpen.value = false;
    }
  });
</script>

<template>
  <aside
    v-if="width < 768 && isMobileAsideOpen"
    class="[grid-area:1/1] fixed left-1/2 -translate-x-1/2 z-30 mt-20 bg-white w-3/4 max-w-[264px] h-fit py-4 space-y-5 rounded-lg"
  >
    <span class="block uppercase text-sm tracking-[2.4px] px-6">
      All Boards ({{ boards?.length }})
    </span>
    <BoardMenu ref="boardMenu" />
  </aside>

  <aside
    v-else
    class="pb-8 col-start-1 bg-white dark:bg-dark-grey"
    :class="[isSidebarToggled ? 'hidden' : 'flex flex-col justify-between']"
  >
    <div class="w-full space-y-3">
      <section class="px-6 h-14 flex items-center">
        <button type="button" @click="navigateTo('/')">
          <SvgLogo size="lg" />
        </button>
      </section>

      <BoardMenu />
    </div>

    <div class="space-y-4">
      <div class="px-6">
        <div
          class="h-12 w-full bg-light-grey dark:bg-very-dark-grey flex justify-center items-center gap-6 rounded-md"
        >
          <SvgIcons icon="sun" />

          <button
            class="flex items-center w-10 h-5 px-1 bg-main-purple hover:bg-dim-purple rounded-full"
            :class="[
              $colorMode.value === 'light' ? 'justify-start' : 'justify-end',
            ]"
            @click="toggleColorMode()"
          >
            <ColorScheme>
              <div class="w-[14px] h-[14px] bg-white rounded-full"></div
            ></ColorScheme>
          </button>

          <SvgIcons icon="moon" />
        </div>
      </div>

      <button
        type="button"
        class="group bg-transparent hover:bg-white w-60 h-12 px-6 text-lg truncate rounded-r-full"
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
