import { useGuest } from "@/context/guestContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useSaveOrder = (boardId) => {
  const queryClient = useQueryClient();
  const { guestId } = useGuest();

  return useMutation({
    mutationFn: async (newOrder) => {
      const headers = guestId ? { "Guest-ID": guestId } : {};
      const response = await axios.put(
        `/api/list`,
        { boardId, lists: newOrder },
        { headers }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};
