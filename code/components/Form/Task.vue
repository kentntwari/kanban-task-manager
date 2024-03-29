<script
  lang="ts"
  setup
>
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod';

import type { BoardTasks } from '~/types';

const emit = defineEmits<{
  create: [void]
}>()

const isComboSelectOpen = ref(false)

const {$client} = useNuxtApp()

const {data:currentBoardTasks} = useNuxtData<BoardTasks>('current-board-tasks')

const selected = ref(currentBoardTasks.value?.columns[0].name ?? '')

const {handleSubmit, isSubmitting} = useForm({
  initialValues:{
    taskStatus: selected.value
  },
  validationSchema: toTypedSchema(z.object({
    taskTitle: z.string({
      required_error:'title is required'
    }).min(1),
    taskDescription: z.string().nullish(),
    taskStatus: z.string(),
    subTasks: z.array(z.object({
      title:z.string({
        required_error: 'can\'t be empty'
      }).min(1)
    })).nullish()
  }))
})

const onSubmit = handleSubmit(values =>{
  return $client.addNewTask.mutate({
    title: values.taskTitle,
    description: values.taskDescription ? values.taskDescription : null,
    status: values.taskStatus,
    subTasks: values.subTasks ? values.subTasks : null
  }).then(()=>emit('create'))
})
</script>

<template>
  <form
    class="form"
    @submit="onSubmit"
  >
    <slot name="title"></slot>
    <FormBaseInput
      label="Title"
      name="taskTitle"
      placeholder="e.g: Take coffee break"
      :disabled="isSubmitting"
    />

    <VeeField
      name="taskDescription"
      v-slot="{handleChange}"
    >
      <div class="space-y-2">
        <label class="block w-full text-sm">Description</label>
        <textarea
          cols="30"
          rows="5"
          class="form-input"
          @change="handleChange"
        ></textarea>
      </div>
    </VeeField>

    <fieldset class="space-y-2">
      <legend class="block w-full text-sm">Subtasks</legend>
      <VeeFieldArray
        name="subTasks"
        v-slot="{fields, push, remove}"
      >
        <div
          v-for="(field,index) in fields"
          :key="field.key"
          class="flex items-center gap-4"
        >
          <FormBaseInput :name="`subTasks[${index}].title`" />
          <button
            type="button"
            class="text-lg"
            @click="remove(index)"
          >
            <SvgIcons icon="cross" />
          </button>
        </div>


        <button
          type="button"
          class="bg-main-purple/10 w-full min-h-10 flex items-center justify-center font-bold text-md text-main-purple rounded-full"
          @click="push({ title: '' })"
        >+ Add New Subtask</button>
      </VeeFieldArray>
    </fieldset>

    <fieldset class="space-y-2">
      <legend class="text-sm">Status</legend>
      <VeeField
        name="taskStatus"
        v-slot="{handleChange}"
      >
        <ComboSelect
          placeholder="Select status..."
          v-model="selected"
          v-model:open="isComboSelectOpen"
          @click="isComboSelectOpen=!isComboSelectOpen"
          @update:modelValue="handleChange"
        >
          <template #empty>No status available</template>
          <template #content>
            <ComboSelectItem
              v-for="(column, index) in currentBoardTasks?.columns"
              :key="index"
              :value="column.name"
            >
              <span class="font-medium">
                {{ column.name }}
              </span>
            </ComboSelectItem>
          </template>
        </ComboSelect>
      </VeeField>
    </fieldset>
    <button
      type="submit"
      class="w-full h-10 bg-main-purple text-md text-white rounded-full"
      :class="[isSubmitting ? 'bg-main-purple/25' : '']"
      :disabled="isSubmitting"
    >
      <span>Create Task</span>
    </button>
  </form>
</template>
