import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useGuest } from "@/context/guestContext";

export const useDeleteBoard = () => {
  const { guestId } = useGuest();

  return useMutation({
    mutationFn: async ({ boardId }) => {
      const headers = guestId ? { "Guest-ID": guestId } : {};
      const response = await axios.delete("/api/boards", {
        headers,
        data: { boardId },
      });
      return response.data;
    },
  });
};
