<script setup lang="ts">
  import type { BoardTasks,Task } from "~/types";

  const props = defineProps<{
    boardId: string;
  }>();

  const { $client} = useNuxtApp();

  const currentTask = useState<Task>("current-task", () => ref(null));

  const { editBoardFn } = useFormUtils();

  const { shouldRefetchBoardData } = useFormUtils();

  const {data:currentBoard} = useAsyncData<BoardTasks>(
    "current-board-tasks",
    () =>
      $client.getBoardTasks.query({
        id: props.boardId,
      }),
    {
      watch: [props, shouldRefetchBoardData],
    }
  )

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
        : 'h-full',
    ]"
  >
    <Modal
      v-model:open="isModalOpen"
      @interact-outside="closeModalFn()"
    >
      <Task
        :task="currentTask"
        @prompt-validate="closeModalFn()"
      />
    </Modal>

    <client-only>
      <div
        v-if="currentBoard.columns.length > 0"
        class="h-full grid grid-flow-col [grid-template-rows:min-content_1fr] auto-cols-max gap-4"
      >
        <div
          v-for="(column, index) in currentBoard.columns"
          class="row-start-1 w-[280px] flex items-center gap-3 uppercase text-asm"
          :key="column.id"
          :class="[`col-start-${index + 1}`]"
        >
          <span
            v-show="column.color !== null"
            class="block w-4 h-4 rounded-full"
            :style="{ backgroundColor: column.color ?? '' }"
          ></span>
          {{ column.name }} ({{ column.tasks.length }})
        </div>

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
              class="bg-white dark:bg-dark-grey px-4 py-6 flex flex-col gap-2 rounded-lg shadow-[0_4px_6px_rgba(54,78,126,0.1)]"
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
                of {{ task.subTasks.length }} subtasks</span>
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

      <div
        v-else
        class="space-y-6"
      >
        <h3 class="text-xl text-center text-balance">
          This board is empty. Create a new column to get started
        </h3>

        <button
          type="button"
          title="add new column"
          class="m-auto px-4 bg-main-purple h-12 flex items-center text-lg text-white rounded-full"
          @click="editBoardFn()"
        >
          + Add New Column
        </button>
      </div>
    </client-only>
  </div>

  <div v-else>Loading board tasks...</div>
</template>
