import { useGuest } from "@/context/guestContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteCard = (boardId, listId) => {
  const queryClient = useQueryClient();
  const { guestId } = useGuest();

  return useMutation({
    mutationFn: async (cardId) => {
      const headers = guestId ? { "Guest-ID": guestId } : {};
      const response = await axios.delete("/api/card", {
        headers,
        data: { boardId, listId, cardId },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};
