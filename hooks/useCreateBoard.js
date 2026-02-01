import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useGuest } from "@/context/guestContext";

export const useCreateBoard = () => {
  const { guestId } = useGuest();

  return useMutation({
    mutationFn: async (boardData) => {
      const headers = guestId ? { "Guest-ID": guestId } : {};
      const response = await axios.post("/api/boards", boardData, { headers });
      return response.data;
    },
  });
};
