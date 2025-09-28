"use client";

import { useMutation } from "@tanstack/react-query";
import { useClient } from "../supabase";

export function useCreateTask() {
  const client = useClient();

  const mutation = useMutation({
    mutationKey: ["create-task", client],
    mutationFn: async (task: Pick<Task, "title" | "notes" | "expires_at">) => {
      const userId = await client.auth.getUser();

      if (userId.error) {
        throw new Error("Failed to fetch user id");
      }

      const res = await client
        .from("tasks")
        .insert([{ ...task, user_id: userId.data.user.id }])
        .select("*");

      if (res.error) {
        throw new Error(res.error?.message ?? res.statusText);
      }

      return {
        data: res.data as Task[],
        count: res.count,
      };
    },
  });

  return { mutation };
}
