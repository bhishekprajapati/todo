import { Button } from "@/components/ui/button";
import config from "@/config";
import { withBase } from "@/utils/auth";
import Link from "next/link";

export default function SignInButton() {
  return (
    <Button asChild size="sm" variant={"outline"}>
      <Link href={withBase(config.auth.pages.signin.name)}>Sign in</Link>
    </Button>
  );
}
