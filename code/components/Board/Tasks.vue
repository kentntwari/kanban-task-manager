<script
  setup
  lang="ts"
>
import type { Task, Board } from '~/types';

const props = defineProps<{
  board: string
}>() 

// TODO: Find other ways to retrive the data rather than depending on useNuxtData. The first alternative was to directly fetch the data but I wanted to avoid multiple server side calls. Also, we're passing the board name as a prop without the id. Either the server side would have to accomodate the board name as a fetch argument or find way to pass the board id and initiate the fetch

  const { $client } = useNuxtApp()

  const { data:allBoards } = useNuxtData<Board>('boards')

  const boardId:Board[number]['id'] | undefined = allBoards.value?.find((x)=>x.name === props.board)?.id

const {data} = useAsyncData('current-board-tasks', ()=> $client.getBoardTasks.query({ id: boardId as string }))

const currentTask =useState<Task>('current-task', ()=> ref(null))

const {toggleNewColumnUI} = useFormUtils()

const isViewTaskModalOpen= ref(false)
</script>


<template>
  <div
    v-if="data"
    :class="[data.columns.length === 0 ? 'w-full h-full flex items-center justify-center' : '']"
  >
    <div
      v-if="data.columns.length > 0"
      class="grid grid-flow-col gap-4"
    >

      <span
        v-for="(column, index) in data.columns"
        class="row-start-1 w-[280px] uppercase text-asm"
        :class="[`col-start-${index + 1}`]"
      >
        {{ column.name }} ({{ column.tasks.length}})
      </span>

      <Modal v-model:open="isViewTaskModalOpen">
        <Task :task="currentTask" />
      </Modal>

      <article
        v-for="(column, index) in data.columns"
        class="row-start-2 w-[280px] space-y-5"
        :style="{'grid-column-start': index + 1}"
      >


        <div
          v-for="task in column.tasks"
          class="flex flex-col gap-4 cursor-pointer"
        >
          <div
            class="bg-white px-4 py-6 flex flex-col gap-2 rounded-lg shadow-sm"
            @click="event =>{
              isViewTaskModalOpen = true
              currentTask=task
            }"
          >
            <span class="text-lg text-black"> {{ task.title }} </span>
            <span class="text-sm">
              {{ task.subTasks.filter(({isCompleted}) => isCompleted ===
              true).length }} of {{ task.subTasks.length }} subtasks</span>

          </div>
        </div>
      </article>

      <div
        class="row-start-2 bg-medium-grey/5 w-[280px] h-full flex items-center justify-center rounded-lg cursor-pointer"
        @click="toggleNewColumnUI()"
      >
        <span class="text-xl">+New Column</span>
      </div>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <h3 class="text-xl text-center">This board is empty. Create a new column
        to get started</h3>

      <button
        type="button"
        class="m-auto px-4 bg-main-purple h-12 flex items-center text-lg text-white rounded-full"
        @click="toggleNewColumnUI()"
      >+ Add
        New Column</button>
    </div>
  </div>
</template>
