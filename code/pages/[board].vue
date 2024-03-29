<script
    setup
    lang="ts"
>
const route = useRoute()

const {data:boards} = useBoards()

const currentBoardId = computed(()=>{
    if(boards.value) {
       const b = boards.value.find((board)=> board.name === route.params.board as string) 

       if(typeof b !== 'undefined') return b.id

       return ''
    }

    return ''
})
</script>


<template>
    <BoardTasks :boardId="currentBoardId" />
</template>
