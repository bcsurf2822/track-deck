import { useGuest } from "@/context/guestContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useSaveCardOrder(boardId) {
  const queryClient = useQueryClient();
  const { guestId } = useGuest();

  return useMutation({
    mutationFn: async ({
      cardId,
      sourceListId,
      destinationListId,
      newIndex,
    }) => {
      const headers = guestId ? { "Guest-ID": guestId } : {};
      const response = await axios.put(
        "/api/card",
        { boardId, cardId, sourceListId, destinationListId, newIndex },
        { headers }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
}
