export default function useFormUtils() {
	const isFormModalOpen = useState("is-form-modal-open", () => ref(false));
	const isFormBoardOpen = useState("is-form-board-open", () => ref(false));
	const shouldAddNewBoard = useState("should-add-new-board", () => ref(false));
	const shouldAddNewColumn = useState("should-add-new-column", () =>
		ref(false)
	);

	function toggleNewBoardUI() {
		isFormModalOpen.value = true;
		isFormBoardOpen.value = true;
		shouldAddNewBoard.value = true;
	}

	function toggleNewColumnUI() {
		isFormModalOpen.value = true;
		isFormBoardOpen.value = true;
		shouldAddNewColumn.value = true;
	}

	watch(
		() => isFormModalOpen.value,
		(val) => {
			if (val === false) isFormBoardOpen.value = false;
		}
	);

	watch(
		() => isFormBoardOpen.value,
		(val) => {
			if (val === false) {
				shouldAddNewBoard.value = false;
				shouldAddNewColumn.value = false;
			}
		}
	);

	return {
		isFormModalOpen: useState<boolean>("is-form-modal-open"),
		isFormBoardOpen: useState<boolean>("is-form-board-open"),
		shouldAddNewBoard: useState<boolean>("should-add-new-board"),
		shouldAddNewColumn: useState<boolean>("should-add-new-column"),
		toggleNewBoardUI,
		toggleNewColumnUI,
	};
}
