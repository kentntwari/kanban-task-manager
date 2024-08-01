import type { Board } from "~/types";

export default function useBoards() {
  const { $client, $auth } = useNuxtApp();

  return useAsyncData<Board>("boards", () =>
    $client.getBoardNames.query({ userId: $auth.user?.id ?? "" })
  );
}
