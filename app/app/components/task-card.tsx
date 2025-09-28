"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

function isOverDue(deadline: Date): boolean {
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  return diffMs <= 0;
}

function formatRelative(deadline: Date): string {
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();

  if (diffMs <= 0) return "Overdue";

  const mins = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `In ${years} year${years > 1 ? "s" : ""}`;
  if (months > 0) return `In ${months} month${months > 1 ? "s" : ""}`;
  if (weeks > 0) return `In ${weeks} week${weeks > 1 ? "s" : ""}`;
  if (days > 0) return `In ${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0) return `In ${hours} hour${hours > 1 ? "s" : ""}`;

  return `In ${mins} minute${mins > 1 ? "s" : ""}`;
}

function RenderDeadlineTag(props: { date: Date }) {
  const { date } = props;
  const [datetime, setDateTime] = useState(date);
  const [label, setLabel] = useState("");

  useEffect(() => {
    setDateTime(date);
  }, [date]);

  useEffect(() => {
    setLabel(formatRelative(datetime));
  }, [datetime]);

  return label ? (
    <span className="inline-flex items-center gap-[.5em] text-sm dark:text-zinc-300 dark:bg-zinc-950 px-[.75em] py-[.5em] rounded-full">
      <Calendar className="w-[1em] h-[1em]" />
      {label}
    </span>
  ) : null;
}

type TTaskCardProps = {
  task: Task;
};

export function TaskCard(props: TTaskCardProps) {
  const { task } = props;
  const isDisabled = isOverDue(task.expires_at);

  return (
    <form className={clsx("select-none", { "opacity-50": isDisabled })}>
      <Card className="p-2.5">
        <CardContent className="p-0">
          <div className="flex items-start gap-4 mb-4">
            <Checkbox color="success" disabled={isDisabled} />

            <div className="flex-1">
              <h3 className="font-medium font-heading mb-4">{task.title}</h3>
              <Textarea
                rows={10}
                className="resize-none w-full overflow-y-auto !bg-transparent !border-none !outline-none !p-0 text-sm !ring-0"
                placeholder="notes..."
                disabled={isDisabled}
              />
            </div>
          </div>
          <div>
            <RenderDeadlineTag date={task.expires_at} />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
