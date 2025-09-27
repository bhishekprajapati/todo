import { buttonVariants } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AppButton() {
  return (
    <Link
      href="/app"
      className={buttonVariants({
        className: "bg-accent text-accent-foreground hover:bg-accent/75",
      })}
    >
      Go to app <ChevronRight size={16} />
    </Link>
  );
}
