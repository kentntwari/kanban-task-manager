<script
  setup
  lang="ts"
>
import type { Task } from '~/types';

const props = defineProps<{
  boardId: string | null
}>() 

const { $client } = useNuxtApp()

const data = await $client.getBoardTasks.query({ id: props.boardId })

const openModal= ref(false)

const currentTask = ref<Task>(null)
</script>


<template>
  <div
    v-if="data"
    :class="[data.columns.length === 0 ? 'absolute top-1/2 left-1/2' : '']"
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

      <ModalTask
        v-model:open="openModal"
        :task="currentTask"
      />

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
              openModal = true
              currentTask=task
            }"
          >
            <span class="text-lg text-black">{{ task.title }}</span>
            <span class="text-sm">
              {{ task.subTasks.filter(({isCompleted}) => isCompleted ===
              true).length }} of {{ task.subTasks.length }} subtasks</span>

          </div>
        </div>
      </article>

      <div
        class="row-start-2 bg-medium-grey/5 w-[280px] h-full flex items-center justify-center rounded-lg"
      >
        <span class="text-xl">+New Column</span>
      </div>
    </div>

  </div>
</template>
