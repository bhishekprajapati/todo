"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TUseTasksOptions, useTasks } from "@/hooks/queries/use-tasks";
import { cn } from "@/lib/utils";
import { CreateTaskButton } from "./buttons/create-task";
import { TaskCard } from "./task-card";
import TaskCardLoader from "./task-card-loader";

import {
  ArrowDownZa,
  ArrowUpDown,
  ArrowUpZa,
  CalendarOff,
  Check,
  SmilePlus,
  Timer,
  TriangleAlert,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { omit } from "remeda";

type TTaskSearchInput = {
  onSearch?: (query: string) => void;
} & React.ComponentProps<typeof Input>;

function TaskSearchInput(props: TTaskSearchInput) {
  const { onSearch, ...restProps } = props;
  const onSearchDebounced = useMemo(() => onSearch, [onSearch]);

  return (
    <span className="inline-flex items-center gap-2">
      <Input
        {...restProps}
        placeholder="search by title..."
        onChange={
          onSearchDebounced
            ? (e) => onSearchDebounced(e.target.value.trim())
            : undefined
        }
      />
    </span>
  );
}

type TTaskSortButton = {
  sort: TUseTasksOptions["sort"];
  onChange: (sort: TUseTasksOptions["sort"]) => void;
};

function TaskSortButton(props: TTaskSortButton) {
  const { sort, onChange } = props;
  const isSorted = !!sort;
  const isAsc = sort ? sort[1] === "asc" : false;
  const Icon = isSorted ? (isAsc ? ArrowUpZa : ArrowDownZa) : ArrowUpDown;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Icon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={sort ? sort[0] : undefined}
          onValueChange={(by) => {
            if (sort && sort[0] === by) {
              return onChange([by, sort[1] === "asc" ? "desc" : "asc"]);
            } else {
              // @ts-expect-error ...
              onChange([by, "asc"]);
            }
          }}
        >
          <DropdownMenuRadioItem value="expires_at">
            Due At
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="completed_at">
            Completed At
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="created_at">
            Created At
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="updated_at">
            Updated At
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onChange(undefined)}>
          Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyTaskList() {
  return (
    <div className="border border-border rounded-xl p-16 bg-card text-card-foreground text-center">
      <SmilePlus size={36} className="text-primary inline-block mb-4" />
      <h2 className="font-medium text-lg">Let&apos;s add your first task</h2>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="border border-red-400/15 p-16 rounded-xl text-center text-red-400">
      <TriangleAlert size={36} className="inline-block mb-4" />
      <h2 className="font-medium text-lg">{message}</h2>
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
  const [opts, setOpts] = useState<TUseTasksOptions>({
    sort: ["expires_at", "asc"],
  });
  const { query } = useTasks(opts);

  function handleTaskSearch(query: string) {
    const isCleared = !query;

    if (isCleared) {
      setOpts(({ sort, filter }) => ({
        sort,
        filter: omit(filter ?? {}, ["title"]),
      }));

      return;
    }

    setOpts(({ sort, filter }) => ({
      sort,
      filter: {
        ...filter,
        title: {
          search: query,
        },
      },
    }));
  }

  function handleTaskSortChange(sort: TUseTasksOptions["sort"]) {
    setOpts(({ filter }) => ({ filter, sort }));
  }

  return (
    <>
      <div className="py-4 flex items-center gap-4 mb-4">
        <TaskSearchInput onSearch={handleTaskSearch} />
        <span className="me-auto" />
        {opts.filter?.status && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setOpts(({ filter, sort }) => ({
                    sort,
                    filter: omit(filter ?? {}, ["status"]),
                  }))
                }
              >
                <X size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear status filter</TooltipContent>
          </Tooltip>
        )}
        <Select
          key={opts.filter?.status}
          value={opts.filter?.status}
          onValueChange={(status) => {
            if (
              status === "completed" ||
              status === "overdue" ||
              status === "pending"
            ) {
              setOpts(({ filter, sort }) => ({
                sort,
                filter: { ...omit(filter ?? {}, ["status"]), status },
              }));

              return;
            }

            setOpts(({ filter, sort }) => ({
              sort,
              filter:
                filter === undefined ? undefined : omit(filter, ["status"]),
            }));
          }}
        >
          <SelectTrigger className="w-[10rem]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="completed">
                <Check size={16} /> Completed
              </SelectItem>
              <SelectItem value="overdue">
                <CalendarOff size={16} /> Overdue
              </SelectItem>
              <SelectItem value="pending">
                <Timer size={16} /> Pending
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <TaskSortButton sort={opts.sort} onChange={handleTaskSortChange} />
        <CreateTaskButton />
      </div>

      {query.error ? (
        <ErrorState message={query.error.message} />
      ) : query.data ? (
        query.data.data.length ? (
          <TaskView>
            {query.data.data.map((task) => (
              <TaskViewItem key={task.id}>
                <TaskCard task={task} />
              </TaskViewItem>
            ))}
          </TaskView>
        ) : (
          <EmptyTaskList />
        )
      ) : (
        <TaskView>
          {new Array(10).fill(0).map((_, idx) => (
            <TaskViewItem key={idx}>
              <TaskCardLoader />
            </TaskViewItem>
          ))}
        </TaskView>
      )}
    </>
  );
}
