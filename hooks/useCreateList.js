import { useGuest } from "@/context/guestContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateList = (boardId) => {
  const queryClient = useQueryClient();
  const { guestId } = useGuest();

  return useMutation({
    mutationFn: async (formData) => {
      const headers = guestId ? { "Guest-ID": guestId } : {};
      const response = await axios.post("/api/list", formData, { headers });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId] });
    },
  });
};
