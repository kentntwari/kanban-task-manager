export default function useFormUtils() {
	const isFormBoardOpen = useState("is-form-board-open", () => ref(false));
	const isFormTaskOpen = useState("is-form-task-open", () => ref(false));
	const isAddNewBoard = useState("is-add-new-board", () => ref(false));
	const isEditBoard = useState("is-add-new-column", () => ref(false));
	const isDeleteBoard = useState("is-delete-board", () => ref(false));
	const isAddNewTask = useState("is-add-new-task", () => ref(false));
	const isEditTask = useState("is-edit-task", () => ref(false));
	const shouldRefetchBoardData = useState("should-refetch-board-data", () =>
		ref(false)
	);

	function addNewBoardFn() {
		resetAllActions();
		isFormBoardOpen.value = true;
		isAddNewBoard.value = true;
	}

	function editBoardFn() {
		resetAllActions();
		isFormBoardOpen.value = true;
		isEditBoard.value = true;
	}

	function deleteBoardFn() {
		resetAllActions();
		isDeleteBoard.value = true;
	}

	function addNewTaskFn() {
		resetAllActions();
		isFormTaskOpen.value = true;
		isAddNewTask.value = true;
	}

	function editTaskFn() {
		resetAllActions();
		isFormTaskOpen.value = true;
		isEditTask.value = true;
	}

	function resetAllActions() {
		isFormBoardOpen.value = false;
		isFormTaskOpen.value = false;
		isDeleteBoard.value = false;
		isAddNewBoard.value = false;
		isEditBoard.value = false;
		isAddNewTask.value = false;
		isEditTask.value = false;
		shouldRefetchBoardData.value = false;
	}

	watch(
		() => isFormBoardOpen.value,
		(val) => {
			if (val === false) {
				isAddNewBoard.value = false;
				isEditBoard.value = false;
			}
		}
	);

	return {
		isFormBoardOpen: useState<boolean>("is-form-board-open"),
		isFormTaskOpen: useState<boolean>("is-form-task-open"),
		isDeleteBoard: useState<boolean>("is-delete-board"),
		isAddNewBoard: useState<boolean>("is-add-new-board"),
		isEditBoard: useState<boolean>("is-add-new-column"),
		isAddNewTask: useState<boolean>("is-add-new-task"),
		isEditTask: useState<boolean>("is-edit-task"),
		shouldRefetchBoardData: useState<boolean>("should-refetch-board-data"),
		addNewBoardFn,
		editBoardFn,
		deleteBoardFn,
		addNewTaskFn,
		editTaskFn,
	};
}
