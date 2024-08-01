<script setup lang="ts">
  const route = useRoute();

  const { $client, $auth } = useNuxtApp();

  const { data: currentBoard } = useAsyncData("current-board-id", async () => {
    if (
      route.params.board &&
      typeof route.params.board === "string" &&
      $auth.user
    )
      return await $client.getBoardId.query({
        boardName: route.params.board,
        userId: $auth.user.id,
      });
  });

  useHead({
    title: `${route.params.board}`,
  });
</script>

<template>
  <BoardTasks v-if="currentBoard" :boardId="currentBoard.id" />

  <div v-else>Loadig current board id ...</div>
</template>
