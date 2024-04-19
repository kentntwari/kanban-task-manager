import type { Board } from "~/types";

export default function useBoards() {
  const { $client, payload, static: nuxtStatic } = useNuxtApp();

  return useAsyncData<Board>("boards", () => $client.getBoardNames.query());
}
