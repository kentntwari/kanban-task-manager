<script lang="ts" setup>
  import type { BoardTasks } from "~/types";

  import { z } from "zod";
  import { toTypedSchema } from "@vee-validate/zod";

  const emit = defineEmits<{
    delete: [void];
    cancel: [void];
  }>();

  const { $client, $auth } = useNuxtApp();

  const { data: currentBoard } = useNuxtData<BoardTasks>("current-board-tasks");

  const { handleSubmit } = useForm({
    validationSchema: toTypedSchema(
      z.object({
        boardId: z.string().default(currentBoard.value?.id ?? ""),
      })
    ),
  });

  const onSubmit = handleSubmit((values) => {
    if (currentBoard.value && $auth.user)
      return $client.deleteBoard
        .mutate({ boardId: values.boardId, userId: $auth.user.id })
        .then(() => emit("delete"));

    return;
  });
</script>

<template>
  <form @submit="onSubmit" class="w-full flex flex-col gap-6">
    <h2 class="text-xl text-red">Delete this board?</h2>
    <p class="text-md">
      Are you sure you want to delete the "{{ currentBoard?.name ?? "" }}"
      board? This action will remove all columns and tasks and cannot be
      reversed
    </p>

    <div class="w-full group:text-md flex flex-col md:flex-row gap-4">
      <button
        type="submit"
        title="delete board"
        class="w-full bg-red h-10 text-white rounded-full"
      >
        Delete
      </button>
      <button
        type="button"
        title="cancel"
        class="bg-transparent dark:bg-white w-full h-10 text-main-purple rounded-full"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>
