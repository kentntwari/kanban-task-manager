<script setup lang="ts">
  definePageMeta({
    middleware: ["protected"],
  });

  const { data } = useBoards();
</script>

<template>
  <BoardTasks v-if="!!data" :boardId="data[0].id" />
  <div v-else>You  have no boards yet!</div>
</template>
