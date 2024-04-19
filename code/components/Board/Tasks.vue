<script setup lang="ts">
  import type { Task } from "~/types";

  const props = defineProps<{
    boardId: string;
  }>();

  const currentTask = useState<Task>("current-task", () => ref(null));

  const { editBoardFn } = useFormUtils();

  const { data: currentBoard } = useCurrentBoard(props.boardId);

  const {
    isRevealed: isModalOpen,
    reveal: openModalFn,
    cancel: closeModalFn,
  } = useConfirmDialog();
</script>

<template>
  <div
    v-if="currentBoard"
    :class="[
      currentBoard.columns.length === 0
        ? 'w-full h-full flex items-center justify-center'
        : '',
    ]"
  >
    <Modal v-model:open="isModalOpen" @interact-outside="closeModalFn()">
      <Task :task="currentTask" @prompt-validate="closeModalFn()" />
    </Modal>

    <client-only>
      <div
        v-if="currentBoard.columns.length > 0"
        class="grid grid-flow-col auto-cols-max gap-4"
      >
        <span
          v-for="(column, index) in currentBoard.columns"
          class="row-start-1 w-[280px] uppercase text-asm"
          :key="column.id"
          :class="[`col-start-${index + 1}`]"
        >
          {{ column.name }} ({{ column.tasks.length }})
        </span>

        <article
          v-for="(column, index) in currentBoard.columns"
          class="row-start-2 w-[280px] space-y-5"
          :key="column.id"
          :style="{ 'grid-column-start': index + 1 }"
        >
          <div
            v-for="task in column.tasks"
            :key="task.id"
            class="group flex flex-col gap-4 cursor-pointer"
          >
            <div
              class="bg-white dark:bg-dark-grey px-4 py-6 flex flex-col gap-2 rounded-lg shadow-sm"
              @click="
                (event) => {
                  currentTask = task;
                  openModalFn();
                }
              "
            >
              <span
                class="text-lg text-black dark:text-white group-hover:text-main-purple"
              >
                {{ task.title }}
              </span>
              <span class="text-sm">
                {{
                  task.subTasks.filter(
                    ({ isCompleted }) => isCompleted === true
                  ).length
                }}
                of {{ task.subTasks.length }} subtasks</span
              >
            </div>
          </div>
        </article>

        <div
          class="row-start-2 bg-medium-grey/5 w-[280px] h-full flex items-center justify-center rounded-lg cursor-pointer"
          @click="editBoardFn()"
        >
          <span class="text-xl">+New Column</span>
        </div>
      </div>

      <div v-else class="space-y-6">
        <h3 class="text-xl text-center">
          This board is empty. Create a new column to get started
        </h3>

        <button
          type="button"
          class="m-auto px-4 bg-main-purple h-12 flex items-center text-lg text-white rounded-full"
          @click="editBoardFn()"
        >
          + Add New Column
        </button>
      </div>
    </client-only>
  </div>
</template>
