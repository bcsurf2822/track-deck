import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useLogoutGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ guestId }) => {
      const response = await axios.delete("/api/auth/guest", {
        data: { guestId },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["boards", "authenticated"], []);
      queryClient.removeQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["guestUser"] });
    },
  });
};
