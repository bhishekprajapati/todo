import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle, Trash } from "lucide-react";
import { ButtonProps } from "react-day-picker";

type TDeleteTaskButtonProps = Omit<ButtonProps, "variant" | "size"> & {
  isLoading?: boolean;
};

export function DeleteTaskButton(props: TDeleteTaskButtonProps) {
  const { className, isLoading = false, ...restProps } = props;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "cursor-pointer hover:text-red-400",
        { "bg-background": isLoading },
        className,
      )}
      {...restProps}
    >
      {isLoading ? (
        <LoaderCircle size={12} className="animate-spin" />
      ) : (
        <Trash size={12} />
      )}
    </Button>
  );
}
