import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignInButton() {
  return (
    <Button asChild size="sm" variant={"outline"}>
      <Link href="/auth/signin">Sign in</Link>
    </Button>
  );
}
