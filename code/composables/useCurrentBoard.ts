import type { BoardTasks } from "~/types";

export default function useCurrentBoard(currentBoardId: string) {
	const { $client, payload, static: nuxtStatic } = useNuxtApp();

	const { data: boards } = useBoards();

	const { shouldRefetchBoardData } = useFormUtils();

	const reactiveBoardId = ref(currentBoardId);

	return useAsyncData<BoardTasks>(
		"current-board-tasks",
		() =>
			$client.getBoardTasks.query({
				id: reactiveBoardId.value,
			}),
		{
			watch: [boards, reactiveBoardId, shouldRefetchBoardData],
		}
	);
}
