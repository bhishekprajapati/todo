"use client";

import { useMutation } from "@tanstack/react-query";
import { useClient } from "../supabase";

export function useUpdateTask() {
  const client = useClient();

  const mutation = useMutation({
    mutationKey: ["update-task", client],
    mutationFn: async (ctx: {
      id: string;
      payload: Pick<Partial<Task>, "title" | "notes" | "completed_at">;
    }) => {
      const { id, payload } = ctx;
      const userId = await client.auth.getUser();

      if (userId.error) {
        throw new Error("Failed to fetch user id");
      }

      const res = await client.from("tasks").update(payload).eq("id", id);

      if (res.error) {
        throw new Error(res.error?.message ?? res.statusText);
      }

      return res.data;
    },
  });

  return { mutation };
}
