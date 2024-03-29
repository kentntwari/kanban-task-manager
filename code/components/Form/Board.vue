<script
  setup
  lang="ts"
>
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod';

import type { BoardTasks } from '~/types';

const {$client} = useNuxtApp()

const {data:currentBoardTasks} = useNuxtData<BoardTasks>('current-board-tasks')

const {isEditBoard} = useFormUtils()

const computedInitialValues = computed(()=>{
  if(isEditBoard.value) {
    return {
      boardName: currentBoardTasks.value?.name ?? '',
      columns: currentBoardTasks.value?.columns.map((x)=>({id:x.id, name:x.name})),
    }
  }

  else
  return {
    boardName: '',
  }
})

const emit = defineEmits<{
  create:[id:string | undefined, name:string],
  edit: [void],
  cancel:[void]
}>()

const { handleSubmit, isSubmitting } = useForm({
  initialValues: computedInitialValues.value,
  validationSchema: toTypedSchema(z.object({
  boardName: z.string({required_error: 'name is required'}).min(1),
  columns: z.array(z.object({
    id:z.string().default(''),
    name: z.string({required_error: 'can\'t be empty'}).min(1)
  })).nullish()
})),
});


const onSubmit = handleSubmit(values => {
if(!isEditBoard.value){
  return $client.addNewBoard.mutate({boardName:values.boardName, columns:(values.columns && values.columns.length > 0) ? values.columns : null}).then((res)=> {
        return emit('create', res?.id, !res?.name ? values.boardName : res.name)
})
}

else 
if(isEditBoard && currentBoardTasks.value && values.columns)
  return $client.editColumn.mutate({boardId: currentBoardTasks.value?.id, columns: values.columns}).then((res)=> emit('edit'))

  else emit('cancel')
});
</script>

<template>
  <form
    class="form"
    @submit="onSubmit"
  >
    <slot name="title"></slot>
    <FormBaseInput
      label="Board Name"
      name="boardName"
      placeholder="e.g: Web design"
      :disabled="isEditBoard ? true : false"
    />
    <VeeFieldArray
      name="columns"
      v-slot="{fields, push, remove}"
    >
      <fieldset class="space-y-2">
        <legend class="block w-full text-sm">Board columns</legend>
        <div
          v-for="(field,index) in fields"
          :key="field.key"
          class="flex items-center gap-4"
        >
          <FormBaseInput
            :name="`columns[${index}].name`"
            type="text"
          />
          <button
            type="button"
            class="text-lg"
            @click="remove(index)"
          >
            <SvgIcons icon="cross" />
          </button>
        </div>
      </fieldset>

      <button
        type="button"
        class="bg-main-purple/10 w-full min-h-10 flex items-center justify-center font-bold text-md text-main-purple rounded-full"
        @click="push({ name: '' })"
      >+ Add New Column</button>
    </VeeFieldArray>

    <button
      type="submit"
      class="form-button"
      :class="isSubmitting ? 'bg-main-purple/25' : ''"
      :disabled="isSubmitting"
    >
      <span v-show="isEditBoard">Save Changes</span>
      <span v-show="!isEditBoard">Create New Board</span>
    </button>
  </form>
</template>
