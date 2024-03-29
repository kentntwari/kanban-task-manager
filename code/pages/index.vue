<script
    setup
    lang="ts"
>
const {data} = useBoards()

</script>

<template>
    <BoardTasks
        v-if="data"
        :boardId="data[0].id"
    />
</template>