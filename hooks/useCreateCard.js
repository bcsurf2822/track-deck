import { useGuest } from "@/context/guestContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateCard = (boardId) => {
  const queryClient = useQueryClient();
  const { guestId } = useGuest();

  return useMutation({
    mutationFn: async (formData) => {
      const headers = guestId ? { "Guest-ID": guestId } : {};
      const response = await axios.post("/api/card", formData, { headers });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};
