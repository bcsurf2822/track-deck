import { useGuest } from "@/context/guestContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteList = (boardId) => {
  const queryClient = useQueryClient();
  const { guestId } = useGuest();

  return useMutation({
    mutationFn: async ({ listId }) => {
      const headers = guestId ? { "Guest-ID": guestId } : {};
      const response = await axios.delete("/api/list", {
        headers,
        data: { boardId, listId },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};
