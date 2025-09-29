"use client";

import { useMutation } from "@tanstack/react-query";
import { useClient } from "../supabase";

export function useDeleteTask() {
  const client = useClient();

  const mutation = useMutation({
    mutationKey: ["delete-task", client],
    mutationFn: async (taskId: string) => {
      const userId = await client.auth.getUser();

      if (userId.error) {
        throw new Error("Failed to fetch user id");
      }

      const res = await client.from("tasks").delete().eq("id", taskId);

      if (res.error) {
        throw new Error(res.error?.message ?? res.statusText);
      }

      return res.data;
    },
  });

  return { mutation };
}
