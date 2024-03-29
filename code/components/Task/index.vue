<script
  setup
  lang="ts"
>
import type { Task } from '~/types';

const props = defineProps<{
  task:Task
}>()

const {$client} = useNuxtApp()

const completedSubTasks = computed(()=>{
  if(props.task && props.task.subTasks.length > 0){
    return props.task.subTasks.filter(subTask => subTask.isCompleted === true).length
  }
})

let updatedStatus:string | null = props.task?.status ?? null

let updatedSubTasks:Array<{id:string, isCompleted: boolean}> = []

onUnmounted(async ()=> {
  if(updatedStatus !== props.task?.status || updatedSubTasks.length > 0){
    await $client.updateTask
    .mutate({
      id: props.task?.id as string,
      status: updatedStatus,
      subTasks: updatedSubTasks.length > 0 ? updatedSubTasks : null
    })
    .then(()=> updatedSubTasks.length = 0)
  }
})
</script>

<template>
  <div
    class="flex"
    :class="[!task ? 'flex-row items-center justify-center' : 'flex-col items-start justify-start gap-6' ]"
  >
    <template v-if="!props.task">
      <h2>Loading...</h2>
    </template>

    <template v-else>
      <section class="flex items-start justify-between">
        <div>
          <h2 class="text-xl text-black">
            {{ props.task.title }}
          </h2>
          <p class="min-h-10 font-medium text-md">{{
            props.task.description }}
          </p>
        </div>

        <button type="button">
          <SvgIcons icon="dots" />
        </button>
      </section>


      <div class="w-full flex flex-col gap-4">
        <span class="text-sm">
          Subtasks
          ({{ completedSubTasks}} of {{ props.task.subTasks.length
          }})</span>

        <div class="flex flex-col gap-2">
          <SubTask
            v-for="subTask in props.task.subTasks"
            :id="subTask.id"
            :isCompleted="subTask.isCompleted"
            @update="(id, value) => {
                subTask.isCompleted=value
                const filtered = 
                updatedSubTasks.filter((x) => x.id !== id)
                
                filtered.push({id, isCompleted:value}) 
                updatedSubTasks = filtered
                }"
          >
            {{ subTask.title }}
          </SubTask>
        </div>

        <div class="space-y-2">
          <span class="block text-sm">Current Status</span>
          <TaskStatusSelect
            :taskId="props.task.id"
            :currentStatus="props.task.status"
            @update="(status) => {
                updatedStatus = status
              }"
          />
        </div>
      </div>
    </template>
  </div>
</template>