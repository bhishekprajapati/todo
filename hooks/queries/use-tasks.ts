"use client";

import { isServer, useQuery } from "@tanstack/react-query";
import { useClient } from "../supabase";

export type TUseTasksOptions = {
  sort?: [
    keyof Pick<
      Task,
      "expires_at" | "completed_at" | "created_at" | "updated_at"
    >,
    "asc" | "desc",
  ];
};

export function useTasks(opts: TUseTasksOptions = {}) {
  const client = useClient();

  const query = useQuery({
    queryKey: ["tasks", opts, client],

    queryFn: async () => {
      const { sort } = opts;
      const query = client.from("tasks").select("*");

      if (sort) {
        const [col, order] = sort;
        query.order(col, { ascending: order === "asc" });
      }

      const { data, statusText, error, count } = await query;

      if (error) {
        throw new Error(error?.message ?? statusText);
      }

      return {
        data: data as Task[],
        count,
      };
    },
    enabled: !isServer,
    select({ count, data }) {
      return {
        count,
        data: data.map(({ expires_at, ...rest }) => ({
          ...rest,
          expires_at: new Date(expires_at),
        })),
      };
    },
  });

  return { query };
}
