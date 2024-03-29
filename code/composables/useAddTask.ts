import type { BoardTasks } from "~/types";

export default function useAddTask() {
	const { data: currentBoardTasks } = useNuxtData<BoardTasks>(
		"current-board-tasks"
	);

	const isCanAddTask = ref(true);

	watch(
		() => currentBoardTasks.value?.columns,
		(val) => {
			if (val !== undefined && val.length > 0) {
				isCanAddTask.value = false;
			} else {
				isCanAddTask.value = true;
			}
		}
	);

	onMounted(() => {
		if (currentBoardTasks.value && currentBoardTasks.value?.columns.length > 0)
			isCanAddTask.value = false;
	});

	return { isCanAddTask };
}
