import { Skeleton } from "@/components/ui/skeleton";

export default function TaskCardLoader() {
  return (
    <div className="dark:bg-zinc-900 rounded-2xl flex flex-col p-4">
      <div className="flex gap-2 mb-4">
        <Skeleton className="w-6 h-6" />
        <div className="flex-1">
          <Skeleton className="w-full h-6 mb-4" />
          <Skeleton className="w-full h-16" />
        </div>
      </div>
      <div className="">
        <Skeleton className="p-4 w-24 rounded-full" />
      </div>
    </div>
  );
}
