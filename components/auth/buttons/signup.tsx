import { Button } from "@/components/ui/button";
import config from "@/config";
import { withBase } from "@/utils/auth";
import Link from "next/link";

export default function SignupButton() {
  return (
    <Button asChild size="sm" variant={"default"}>
      <Link href={withBase(config.auth.pages.signup.name)}>Sign up</Link>
    </Button>
  );
}
