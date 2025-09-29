"use client";

import { TUseTasksOptions, useTasks } from "@/hooks/queries/use-tasks";
import { cn } from "@/lib/utils";
import { CreateTaskButton } from "./buttons/create-task";
import { TaskCard } from "./task-card";
import TaskCardLoader from "./task-card-loader";

import { useState } from "react";

function RenderTaskActions(props: { opts: TUseTasksOptions }) {
  const {} = props;

  return (
    <div className="py-4 flex items-center">
      <span className="ms-auto" />
      <CreateTaskButton />
    </div>
  );
}

function TaskView({
  className,
  children,
  ...restProps
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
        className,
      )}
      {...restProps}
    >
      {children}
    </ul>
  );
}

function TaskViewItem({ children, ...restProps }: React.ComponentProps<"li">) {
  return (
    <li className="shadow-2xl" {...restProps}>
      {children}
    </li>
  );
}

export function UserTasks() {
  const [opts] = useState<TUseTasksOptions>({
    sort: ["expires_at", "desc"],
  });

  const { query } = useTasks(opts);

  if (query.error) {
    return "failed to load tasks";
  }

  if (query.data) {
    const tasks = query.data.data;

    if (!tasks.length) {
      return "no tasks";
    }

    return (
      <>
        <RenderTaskActions opts={opts} />
        <TaskView>
          {tasks.map((task) => (
            <TaskViewItem key={task.id}>
              <TaskCard task={task} />
            </TaskViewItem>
          ))}
        </TaskView>
      </>
    );
  }

  const arr = new Array(10).fill(0);

  return (
    <>
      <RenderTaskActions opts={opts} />
      <TaskView>
        {arr.map((_, idx) => (
          <TaskViewItem key={idx}>
            <TaskCardLoader />
          </TaskViewItem>
        ))}
      </TaskView>
    </>
  );
}
