<script setup lang="ts">
  const { data: boards, refresh } = useBoards();

  const isMobileAsideOpen = useState("is-mobile-aside-open");

  const {
    isAddNewBoard,
    isEditBoard,
    shouldRefetchBoardData,
    isAddNewTask,
    isEditTask,
    isDeleteTask,
    isDeleteBoard,
  } = useFormUtils();

  const isModalOpen = computed(() => {
    if (isAddNewBoard.value) return true;
    if (isEditBoard.value) return true;
    if (isDeleteBoard.value) return true;
    if (isDeleteTask.value) return true;
    if (isEditTask.value) return true;
    if (isAddNewTask.value) return true;
    return false;
  });

  const captureSidebarToggledState = ref(false);
</script>

<template>
  <NuxtLoadingIndicator />

  <div
    class="after:content-[''] md:after:hidden after:w-full after:h-full after:top-0 after:left-0 after:bg-black/50"
    :class="[
      isMobileAsideOpen ? 'after:fixed' : 'after:hidden',
      captureSidebarToggledState
        ? ''
        : 'grid grid-cols-1 md:[grid-template-columns:261px_1fr] lg:[grid-template-columns:300px_1fr] ',
    ]"
  >
    <NavigationSideBar
      @toggled="(toggled) => (captureSidebarToggledState = toggled)"
    />

    <div
      class="[grid-area:1/1] md:col-start-2 min-h-screen flex flex-col overflow-hidden"
    >
      <NavigationTopBar v-if="!!boards && boards.length > 0" />

      <main
        class="mt-20 md:mt-0 w-full flex-1 px-4 lg:px-6 py-6 overflow-scroll"
      >
        <slot></slot>

        <Modal
          v-model:open="isModalOpen"
          @interact-outside="
            (event) => {
              if (isAddNewBoard) isAddNewBoard = false;
              if (isEditBoard) isEditBoard = false;
              if (isDeleteTask) isDeleteTask = false;
              if (isEditTask) isEditTask = false;
              if (isAddNewTask) isAddNewTask = false;
            }
          "
        >
          <FormBoard
            v-if="isAddNewBoard || isEditBoard"
            @cancel="
              () => {
                if (isAddNewBoard) isAddNewBoard = false;
                if (isEditBoard) isEditBoard = false;
              }
            "
            @create="
              async (id: string, name: string) => {
                refresh();
                isAddNewBoard = false;
                if (id && isAddNewBoard) boards?.push({ id, name });
                await navigateTo(`/${name}`);
              }
            "
            @update="
              () => {
                refresh();
                shouldRefetchBoardData = true;
                isEditBoard = false;
              }
            "
          >
            <template #title>
              <h2 v-show="isEditBoard" class="form-title">Edit Board</h2>
              <h2 v-show="isAddNewBoard" class="form-title">Add New Board</h2>
            </template>
          </FormBoard>

          <FormDeleteBoard
            v-if="isDeleteBoard"
            @cancel="isDeleteBoard = false"
            @delete="
              async () => {
                refresh();
                isDeleteBoard = false;
                await navigateTo('/');
              }
            "
          />

          <FormTask
            v-if="isAddNewTask || isEditTask"
            @create="
              () => {
                shouldRefetchBoardData = true;
                isAddNewTask = false;
              }
            "
            @update="
              () => {
                shouldRefetchBoardData = true;
                isEditTask = false;
              }
            "
            @cancel="isEditTask = false"
          >
            <template #title>
              <h2 v-show="isEditTask" class="form-title">Edit Task</h2>
              <h2 v-show="isAddNewTask" class="form-title">Add new Task</h2>
            </template>
          </FormTask>

          <FormDeleteTask
            v-if="isDeleteTask"
            @cancel="isDeleteTask = false"
            @delete="
              async () => {
                refresh();
                isDeleteTask = false;
              }
            "
          />
        </Modal>
      </main>
    </div>
  </div>
</template>
