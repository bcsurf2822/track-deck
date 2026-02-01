import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLoginGuest = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  return {
    ...useMutation({
      mutationFn: async () => {
        setErrorMessage("");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          const { data } = await axios.post(
            "/api/auth/guest",
            {},
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);
          return data.guest;
        } catch (error) {
          clearTimeout(timeoutId);

          if (error.name === "AbortError" || error.code === "ECONNABORTED") {
            throw new Error("Request timed out. Please try again.");
          }

          if (error.response) {
            if (error.response.status === 503) {
              throw new Error(
                "Service temporarily unavailable. Please try again in a moment."
              );
            } else if (error.response.status === 500) {
              throw new Error("Server error. Our team has been notified.");
            }
            throw new Error(
              error.response.data?.error ||
                "Failed to log in as a guest. Please try again."
            );
          } else if (error.request) {
            throw new Error(
              "No response from server. Please check your connection."
            );
          } else {
            throw new Error(
              "Failed to connect to the server. Please try again."
            );
          }
        }
      },
      onSuccess: (guest) => {
        queryClient.setQueryData(["guestUser"], guest);
        router.push("/dashboard");
      },
      onError: (error) => {
        setErrorMessage(error.message || "Failed to log in as guest.");
      },
    }),
    errorMessage,
  };
};
