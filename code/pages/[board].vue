<script setup lang="ts">
const route = useRoute()

const {$client} = useNuxtApp()

const {data:currentBoard} = useAsyncData('current-board-id', async ()=>{
    if(route.params.board && typeof route.params.board === 'string') return await $client.getBoardId.query({boardName: route.params. board})
} )
</script>


<template>
    <BoardTasks
        v-if="currentBoard"
        :boardId="currentBoard.id"
    />

    <div v-else>Loadig current board id ...</div>
</template>
