<script lang="ts" setup>
  import { toTypedSchema } from "@vee-validate/zod";
  import type { BoardTasks, Task } from "~/types";
  import * as s from "~/utils/zodSchema";

  const emit = defineEmits<{
    create: [void];
    update: [void];
    cancel: [void];
  }>();

  const { $client, $auth } = useNuxtApp();

  const currentTask = useState<Task>("current-task");

  const { data: currentBoardTasks } = useNuxtData<BoardTasks>(
    "current-board-tasks"
  );

  const { isAddNewTask, isEditTask } = useFormUtils();

  const computedInitialValues = computed(() => {
    if (isEditTask.value)
      return {
        taskTitle: currentTask.value?.title ?? "",
        taskDescription: currentTask.value?.description ?? "",
        taskStatus: currentTask.value?.status ?? "",
        subTasks: currentTask.value?.subTasks.map((x) => ({
          id: x.id,
          title: x.title,
          isCompleted: x.isCompleted,
        })),
      };

    return {
      taskTitle: "",
      taskDescription: "",
      taskStatus: "",
      subTasks: [],
    };
  });

  const { handleSubmit, isSubmitting } = useForm({
    initialValues: computedInitialValues.value,
    validationSchema: toTypedSchema(s.formTask),
  });

  const onSubmit = handleSubmit((values) => {
    if (isAddNewTask.value && currentBoardTasks.value && $auth.user)
      return $client.addNewTask
        .mutate({
          userId: $auth.user.id,
          boardId: currentBoardTasks.value.id,
          title: values.taskTitle,
          description: values.taskDescription,
          status: values.taskStatus,
          subTasks: values.subTasks,
        })
        .then(() => emit("create"));

    if (isEditTask.value && currentTask.value && $auth.user)
      return $client.updateTask
        .mutate({
          id: currentTask.value.id,
          userId: $auth.user.id,
          title: values.taskTitle,
          description: values.taskDescription,
          status: values.taskStatus,
          subTasks: values.subTasks,
        })
        .then(() => emit("update"));
  });
</script>

<template>
  <form class="form" @submit="onSubmit">
    <slot name="title"></slot>
    <FormBaseInput
      label="Title"
      name="taskTitle"
      placeholder="e.g: Take coffee break"
      :disabled="isSubmitting"
    />

    <VeeField name="taskDescription" v-slot="{ handleChange }">
      <div class="space-y-2">
        <label class="block w-full text-sm">Description</label>
        <textarea
          v-model="computedInitialValues.taskDescription"
          cols="30"
          rows="5"
          class="form-input"
          @change="handleChange"
        ></textarea>
      </div>
    </VeeField>

    <fieldset class="space-y-2">
      <legend class="block w-full text-sm">Subtasks</legend>
      <VeeFieldArray name="subTasks" v-slot="{ fields, push, remove }">
        <div
          v-for="(field, index) in fields"
          :key="field.key"
          class="flex items-center gap-4"
        >
          <FormBaseInput :name="`subTasks[${index}].title`" />
          <button
            type="button"
            title="delete subtask"
            class="text-lg"
            @click="remove(index)"
          >
            <SvgIcons icon="cross" />
          </button>
        </div>

        <button
          type="button"
          title="add new subtask"
          class="bg-main-purple/10 dark:bg-white w-full min-h-10 flex items-center justify-center font-bold text-md text-main-purple rounded-full"
          @click="push({ title: '' })"
        >
          + Add New Subtask
        </button>
      </VeeFieldArray>
    </fieldset>

    <fieldset class="space-y-2">
      <legend class="text-sm">Status</legend>
      <VeeField name="taskStatus" v-slot="{ handleChange }">
        <ComboSelect
          placeholder="Select status..."
          v-model="computedInitialValues.taskStatus"
        >
          <template #empty>No status available</template>
          <template #content>
            <ComboSelectItem
              v-for="(column, index) in currentBoardTasks?.columns.map(
                (column) => ({ name: column.name })
              )"
              :key="index"
              :value="column.name"
              @click="handleChange(column.name)"
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
      :title="isEditTask ? 'save changes' : 'create task'"
      class="w-full h-10 bg-main-purple text-md text-white rounded-full"
      :class="[isSubmitting ? 'bg-main-purple/25' : '']"
      :disabled="isSubmitting"
    >
      <span v-show="isAddNewTask">Create Task</span>
      <span v-show="isEditTask">Save changes</span>
    </button>
  </form>
</template>
