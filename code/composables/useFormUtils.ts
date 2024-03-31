export default function useFormUtils() {
	const isAddNewBoard = useState("is-add-new-board", () => ref(false));
	const isEditBoard = useState("is-add-new-column", () => ref(false));
	const isDeleteBoard = useState("is-delete-board", () => ref(false));
	const isAddNewTask = useState("is-add-new-task", () => ref(false));
	const isEditTask = useState("is-edit-task", () => ref(false));
	const isDeleteTask = useState("is-delete-task", () => ref(false));
	const shouldRefetchBoardData = useState("should-refetch-board-data", () =>
		ref(false)
	);

	function addNewBoardFn() {
		resetAllActions();
		isAddNewBoard.value = true;
	}

	function editBoardFn() {
		resetAllActions();
		isEditBoard.value = true;
	}

	function deleteBoardFn() {
		resetAllActions();
		isDeleteBoard.value = true;
	}

	function deleteTaskFn() {
		resetAllActions();
		isDeleteTask.value = true;
	}

	function addNewTaskFn() {
		resetAllActions();
		isAddNewTask.value = true;
	}

	function editTaskFn() {
		resetAllActions();
		isEditTask.value = true;
	}

	function resetAllActions() {
		isDeleteBoard.value = false;
		isDeleteTask.value = false;
		isAddNewBoard.value = false;
		isEditBoard.value = false;
		isAddNewTask.value = false;
		isEditTask.value = false;
		shouldRefetchBoardData.value = false;
	}

	return {
		isDeleteBoard: useState<boolean>("is-delete-board"),
		isDeleteTask: useState<boolean>("is-delete-task"),
		isAddNewBoard: useState<boolean>("is-add-new-board"),
		isEditBoard: useState<boolean>("is-add-new-column"),
		isAddNewTask: useState<boolean>("is-add-new-task"),
		isEditTask: useState<boolean>("is-edit-task"),
		shouldRefetchBoardData: useState<boolean>("should-refetch-board-data"),
		addNewBoardFn,
		editBoardFn,
		deleteBoardFn,
		deleteTaskFn,
		addNewTaskFn,
		editTaskFn,
	};
}
