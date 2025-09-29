"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TResolvedTask } from "@/hooks/queries/use-tasks";
import { cn } from "@/lib/utils";

import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import {
  Calendar,
  CalendarCheck,
  CalendarOff,
  LucideIcon,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteTaskButton } from "./buttons/delete-button";
import { useDeleteTask } from "@/hooks/mutations/use-delete-task";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useUpdateTask } from "@/hooks/mutations/use-update-task";
import { Button } from "@/components/ui/button";

const datetimeTagVariants = cva(
  "inline-flex items-center gap-[.5em] px-[.75em] py-[.5em] rounded-full border",
  {
    variants: {
      size: {
        sm: "text-sm",
        xs: "text-xs",
        xxs: "text-[.625rem]",
      },
      colors: {
        disabled: "dark:border-zinc-400/25 dark:text-zinc-300 dark:bg-zinc-950",
        urgent: "border-red-400/25 bg-red-400/10",
        warning: "border-yellow-400/25 bg-yellow-400/10",
        default: "border-blue-400/25 bg-blue-400/10",
        success: "border-green-400/10 bg-green-400/5",
      },
    },
    defaultVariants: {
      colors: "default",
      size: "sm",
    },
  },
);

type TDatetimeTagProps = {
  date: Date;
  Icon: LucideIcon;
  format: (date: Date) => string;
} & VariantProps<typeof datetimeTagVariants> &
  React.ComponentProps<"span">;

function DatetimeTag(props: TDatetimeTagProps) {
  const { date, colors, Icon, size, className, format, ...restProps } = props;
  const [datetime, setDateTime] = useState(date);
  const [label, setLabel] = useState("");

  useEffect(() => {
    setDateTime(date);
  }, [date]);

  useEffect(() => {
    setLabel(format(datetime));
  }, [datetime, format]);

  return label ? (
    <span
      className={datetimeTagVariants({
        className:
          "whitespace-nowrap overflow-x-hidden line-clamp-1" + " " + className,
        colors,
        size,
      })}
      {...restProps}
    >
      <Icon className="w-[1em] h-[1em]" />
      {label}
    </span>
  ) : null;
}

type TTaskCardProps = {
  task: TResolvedTask;
};

export function TaskCard(props: TTaskCardProps) {
  const { task } = props;
  const { status } = task;

  const isCompleted = status.status === "completed";
  const isOverdue = status.status === "overdue";

  const queryClient = useQueryClient();
  const { mutation: deleteMutation } = useDeleteTask();
  const { mutation: checkMutation } = useUpdateTask();

  const refetchTasks = () =>
    queryClient.refetchQueries({ queryKey: ["tasks"] });

  function handleTaskDelete() {
    deleteMutation.mutateAsync(task.id, {
      onError(err) {
        toast.error(err.message);
      },
      onSuccess() {
        return refetchTasks();
      },
    });
  }

  function handleCheckChange(isChecked: boolean) {
    checkMutation.mutateAsync(
      {
        id: task.id,
        payload: {
          completed_at: isChecked ? new Date() : null,
        },
      },
      {
        onSuccess() {
          return refetchTasks();
        },
        onError(err) {
          toast.error(err.message);
        },
      },
    );
  }

  return (
    <div
      className={clsx("select-none", {
        "opacity-50 cursor-not-allowed": isOverdue,
      })}
    >
      <Card className="p-2.5">
        <CardContent className="p-0">
          <div className="flex items-start gap-4 mb-4">
            <Checkbox
              defaultChecked={isCompleted}
              className={cn("mt-1", {
                "animate-pulse": checkMutation.isPending,
              })}
              color="success"
              disabled={isOverdue || checkMutation.isPending}
              onCheckedChange={handleCheckChange}
            />

            <div className="flex-1">
              <h3
                className={cn("text-lg font-medium font-heading mb-4", {
                  "line-through text-foreground/50": !!task.completed_at,
                })}
              >
                {task.title}
              </h3>
              <p
                className={cn("text-[1rem] min-h-24", {
                  "line-through text-foreground/50": !!task.completed_at,
                })}
              >
                {task.notes}
              </p>
            </div>

            <DeleteTaskButton
              isLoading={deleteMutation.isPending}
              onClick={handleTaskDelete}
              disabled={deleteMutation.isPending}
            />
          </div>

          <div className="flex items-center justify-between">
            {isCompleted && task.completed_at && (
              <DatetimeTag
                Icon={CalendarCheck}
                date={task.completed_at}
                format={() => status.label}
                colors="success"
                size="xs"
              />
            )}

            {isOverdue && (
              <DatetimeTag
                Icon={CalendarOff}
                date={task.expires_at}
                format={() => status.label}
                colors="disabled"
                size="xs"
              />
            )}

            {status.status === "pending" && (
              <>
                <DatetimeTag
                  Icon={Calendar}
                  date={task.expires_at}
                  format={() => status.label}
                  colors={
                    status.isDueToday
                      ? "urgent"
                      : status.isDueThisWeek
                        ? "warning"
                        : "default"
                  }
                  size="xs"
                />

                <Button variant="ghost" size="icon" disabled>
                  <Pencil size={12} />
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
