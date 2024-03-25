<script
  setup
  lang="ts"
>
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod';

import type { BoardTasks } from '~/types';

const {$client} = useNuxtApp()

const {data:currentBoardTasks} = useNuxtData<BoardTasks>('current-board-tasks')

const {isFormModalOpen, shouldAddNewColumn} = useFormUtils()

const veeSchema = toTypedSchema(z.object({
  boardName: z.string({required_error: 'name is required'}).min(1),
  columns: z.array(z.object({
    id:z.string().default(''),
    name: z.string({required_error: 'can\'t be empty'}).min(1)
  })).nullish()
}))

const computedInitialValues = computed(()=>{
  if(shouldAddNewColumn.value) {
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
  created:[id:string | undefined, name:string],
  edited: ['']
}>()

const { handleSubmit } = useForm({
  validationSchema: veeSchema,
  initialValues: computedInitialValues.value
});


const onSubmit = handleSubmit(values => {
if(!shouldAddNewColumn.value){
  return $client.addNewBoard.mutate({boardName:values.boardName, columns:(values.columns && values.columns.length > 0) ? values.columns : null}).then((res)=> {
        return emit('created', res?.id, !res?.name ? values.boardName : res.name)
})
}

else 
if(shouldAddNewColumn && currentBoardTasks.value && values.columns)
  return $client.addNewColumn.mutate({boardId: currentBoardTasks.value?.id, columns: values.columns}).then((res)=> emit('edited', ''))

  else isFormModalOpen.value = false
});
</script>

<template>
  <form
    class="flex flex-col gap-6"
    @submit="onSubmit"
  >
    <slot name="title"></slot>
    <FormBaseInput
      label="Board Name"
      name="boardName"
      placeholder="e.g: Web design"
      :disabled="shouldAddNewColumn ? true : false"
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
      class="w-full h-10 bg-main-purple text-md text-white rounded-full"
    >
      <span v-show="shouldAddNewColumn">Save Changes</span>
      <span v-show="!shouldAddNewColumn">Create New Board</span>
    </button>
  </form>
</template>
