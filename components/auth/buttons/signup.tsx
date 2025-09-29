import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignupButton() {
  return (
    <Button asChild size="sm" variant={"default"}>
      <Link href="/auth/signup">Sign up</Link>
    </Button>
  );
}
