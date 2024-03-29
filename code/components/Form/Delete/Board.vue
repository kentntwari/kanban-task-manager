<script
  lang="ts"
  setup
>
import type { BoardTasks } from '~/types';

import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod';

const emit = defineEmits<{
  delete: [void],
  cancel:[void]
}>()

const { $client} = useNuxtApp()

const {data:currentBoard} = useNuxtData<BoardTasks>('current-board-tasks')

const {handleSubmit} = useForm({
  validationSchema: toTypedSchema(z.object({
    boardId: z.string().default(currentBoard.value?.id ?? '')
  }))
})

const onSubmit = handleSubmit(values => {
  if(currentBoard.value) return $client.deleteBoard.mutate({boardId: values.boardId}).then(()=>emit('delete'))

  return
})
</script>

<template>
  <form
    @submit="onSubmit"
    class="e-full flex flex-col gap-6"
  >
    <h2 class="text-xl text-red">Delete this board?</h2>
    <p class="text-md">Are you sure you want to delete the "{{
      currentBoard?.name ?? '' }}" board? This action will remove all columns
      and tasks and cannot be reversed</p>

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
