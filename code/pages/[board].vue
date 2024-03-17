<script
    setup
    lang="ts"
>
import type { Board } from '~/types';

const route = useRoute()

const { data } = useNuxtData<Board>('boards')
</script>


<template>
    <BoardTasks
        v-if="data"
        :boardId="data.filter(({name})  => name === route.params.board)[0].id"
    />
</template>
