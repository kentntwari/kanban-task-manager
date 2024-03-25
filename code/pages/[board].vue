<script
    setup
    lang="ts"
>
const route = useRoute()

const currentBoard = route.params.board as string
</script>


<template>
    <BoardTasks :board="currentBoard" />
</template>
