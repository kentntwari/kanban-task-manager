<script
  setup
  lang="ts"
>
import type { Task } from '~/types';

const props = defineProps<{
  task:Task
}>()

const open= defineModel<boolean>('open')

const {$client} = useNuxtApp()

const completedSubTasks = computed(()=>{
  if(props.task !== null && props.task.subTasks.length > 0){
    return props.task.subTasks.filter(subTask => subTask.isCompleted === true).length
  }
})

let updatedStatus:string | null = props.task?.status ?? null

let updatedSubTasks:Array<{id:string, isCompleted: boolean}> = []

watch(()=> open.value, (val)=> {
  if(val === true) updatedSubTasks.length = 0
})

async function closeAndUpdate(){
  open.value = false

  if(updatedStatus !== null || updatedSubTasks.length > 0){
    await $client.updateTask.mutate({
      id: props.task?.id as string,
      status: updatedStatus,
      subTasks: updatedSubTasks.length > 0 ? updatedSubTasks : null
    })
  }
}
</script>

<template>
  <DialogRoot
    v-if="open !== undefined"
    :open="open"
  >
    <DialogPortal>
      <DialogOverlay class="bg-black/20 fixed w-screen inset-0 z-30" />
      <DialogContent
        @interact-outside="closeAndUpdate()"
        class="fixed flex flex-col top-[50%] left-[50%] h-[57%] max-h-[85vh] w-11/12 max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100]"
        :class="[!task ? 'items-center justify-center' : 'items-start justify-start gap-6']"
      >
        <template v-if="!props.task">
          <DialogTitle>Loading...</DialogTitle>
        </template>

        <template v-else>
          <DialogTitle class="text-xl text-black">{{ props.task.title }}
          </DialogTitle>
          <DialogDescription class="min-h-10 font-medium text-md">{{
            props.task.description }}
          </DialogDescription>

          <div class="w-full flex flex-col gap-4">
            <span class="text-sm">
              Subtasks
              ({{ completedSubTasks}} of {{ props.task.subTasks.length
              }})</span>

            <div class="flex flex-col gap-2">
              <ModalTaskSubTask
                v-for="subTask in props.task.subTasks"
                :id="subTask.id"
                :isCompleted="subTask.isCompleted"
                @update="(id, value) => {
                  subTask.isCompleted=value
                  const filtered = updatedSubTasks.filter((x) => x.id !== id)
                  filtered.push({id, isCompleted:value}) 
                  updatedSubTasks = filtered
                }"
              >
                {{ subTask.title }}
              </ModalTaskSubTask>
            </div>

            <div class="space-y-2">
              <span class="block text-sm">Current Status</span>
              <ModalTaskStatusSelect
                :taskId="props.task.id"
                :currentStatus="props.task.status"
                @update="(status) => {
                updatedStatus = status
              }"
              />
            </div>

          </div>
        </template>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>