"use client";

import { formatDistanceToNow } from "date-fns";
import { isServer, useQuery } from "@tanstack/react-query";
import { useClient } from "../supabase";

function resolveTaskStatus(task: Task) {
  if (task.completed_at !== null) {
    return {
      status: "completed" as const,
      at: task.completed_at,
      label: `Completed ${formatDistanceToNow(task.completed_at, { addSuffix: true })}`,
    };
  }

  const now = new Date();
  const deadline = task.expires_at;
  const diffMs = deadline.getTime() - now.getTime();

  if (diffMs <= 0) {
    return {
      status: "overdue" as const,
      at: task.expires_at,
      label: `Overdue ${formatDistanceToNow(task.expires_at, { addSuffix: true })}`,
    };
  }

  const mins = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let label = "";
  let isDueToday = false;
  let isDueThisWeek = false;

  if (years > 0) {
    label = `${years} year${years > 1 ? "s" : ""}`;
  } else if (months > 0) {
    label = `${months} month${months > 1 ? "s" : ""}`;
  } else if (weeks > 0) {
    label = `${weeks} week${weeks > 1 ? "s" : ""}`;
  } else if (days > 0) {
    isDueThisWeek = days < 7;
    label = `${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    isDueToday = hours < 24;
    label = `${hours} hour${hours > 1 ? "s" : ""}`;
  } else {
    label = `${mins} minute${mins > 1 ? "s" : ""}`;
  }

  return {
    status: "pending" as const,
    at: task.expires_at,
    label: `Due In ${label}`,
    isDueThisWeek,
    isDueToday,
  };
}

export type TUseTasksOptions = {
  filter?: {
    title?: {
      search: string;
    };
    status?: "completed" | "overdue" | "pending";
    range?: {
      from: Date;
      to: Date;
    };
  };
  sort?: [
    keyof Pick<
      Task,
      "expires_at" | "completed_at" | "created_at" | "updated_at"
    >,
    "asc" | "desc",
  ];
};

export type TResolvedTask = ArrayType<
  NonNullable<ReturnType<typeof useTasks>["query"]["data"]>["data"]
>;

export function useTasks(opts: TUseTasksOptions = {}) {
  const client = useClient();

  const query = useQuery({
    queryKey: ["tasks", opts, client],

    queryFn: async () => {
      const { sort, filter } = opts;
      const query = client.from("tasks").select("*");

      if (sort) {
        const [col, order] = sort;
        query.order(col, { ascending: order === "asc" });
      }

      if (filter?.title?.search) {
        // TODO: enable text search
        query.ilike("title", `%${filter.title.search}%`);
      }

      if (filter?.status) {
        switch (filter.status) {
          case "completed": {
            query.not("completed_at", "is", "null");
            break;
          }

          case "overdue": {
            query.lt("expires_at", new Date().toISOString());
            break;
          }

          case "pending": {
            query
              .is("completed_at", null)
              .gte("expires_at", new Date().toISOString());
            break;
          }
        }
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
      const resolved = data.map((t) => {
        const { expires_at, ...rest } = t;
        const task = {
          expires_at: new Date(expires_at),
          ...rest,
        };

        const status = resolveTaskStatus(task);

        return {
          ...task,
          status,
        };
      });

      return {
        count,
        data: resolved,
      };
    },
  });

  return { query };
}
