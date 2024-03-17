<script
    setup
    lang="ts"
>
import type { Board } from '~/types';

const { data } = useNuxtData<Board>('boards')
</script>

<template>
    <BoardTasks :boardId="!data ? null : data[0].id" />
</template>