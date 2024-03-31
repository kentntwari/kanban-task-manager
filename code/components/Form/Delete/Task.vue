<script
  lang="ts"
  setup
>
import type { Task } from '~/types';

import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod';

const emit = defineEmits<{
  delete: [void],
  cancel:[void]
}>()

const { $client} = useNuxtApp()

const currentTask = useState<Task>('current-task')

const {handleSubmit} = useForm({
  validationSchema: toTypedSchema(z.object({
    taskId: z.string().default(currentTask.value?.id ?? '')
  }))
})

const onSubmit = handleSubmit(values => {
  if(currentTask.value) return $client.deleteTask.mutate({id: values.taskId}).then(()=> emit('delete'))

  return
})
</script>

<template>
  <form
    @submit="onSubmit"
    class="w-full flex flex-col gap-6"
  >
    <h2 class="text-xl text-red">Delete this task?</h2>
    <p class="text-md">Are you sure you want to delete the "{{
      currentTask?.title ?? '' }}" task and its subtasks? This action cannot be
      reversed</p>

    <div class="w-full group:text-md flex flex-col gap-4">
      <button
        type="submit"
        class="bg-red h-10 text-white rounded-full"
      >Delete</button>
      <button
        type="button"
        class="bg-transparent h-10 text-main-purple rounded-full"
        @click="emit('cancel')"
      >Cancel</button>
    </div>
  </form>
</template>
