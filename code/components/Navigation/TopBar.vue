<script lang="ts" setup>
  const { data: boards } = useBoards();

  const { isCanAddTask } = useAddTask();

  const isMobileAsideOpen = useState<boolean>("is-mobile-aside-open");

  const route = useRoute();

  const { isAddNewTask, addNewTaskFn } = useFormUtils();
</script>

<template>
  <header
    class="fixed md:static top-0 z-30 bg-white dark:bg-dark-grey w-full h-16 px-4 lg:px-6 flex items-center justify-between"
  >
    <section class="flex items-center gap-4">
      <NuxtLink to="/" class="md:hidden">
        <SvgLogo size="sm" />
      </NuxtLink>
      <div class="relative flex items-center gap-2">
        <h3 class="text-xl text-black dark:text-white">
          {{ route.path === "/" ? boards?.at(0)?.name : route.params.board }}
        </h3>
        <button
          type="button"
          title="toggle sidebar"
          class="md:hidden before:absolute before:top-0 before:left-0 before:w-full before:h-full"
          @click="isMobileAsideOpen = !isMobileAsideOpen"
        >
          <SvgIcons icon="chevron-down" />
        </button>
      </div>
    </section>

    <div class="flex items-center">
      <button
        type="button"
        title="add new task"
        class="btn-small-primary min-w-12 disabled:bg-main-purple/25"
        :disabled="isCanAddTask"
        @click="
          (event) => {
            isAddNewTask = true;
            addNewTaskFn();
          }
        "
      >
        <SvgIcons icon="plus" />
      </button>
      <BoardPrompt />
    </div>
  </header>
</template>
