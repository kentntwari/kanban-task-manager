<script
    setup
    lang="ts"
>
import type { Board } from '~/types';

const { data } = useNuxtData<Board>('boards')
</script>

<template>
    <BoardTasks
        v-if="data"
        :board="data[0].name"
    />
</template>