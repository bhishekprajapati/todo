import Link from "next/link";
import Logo from "./logo";
import { SignedIn, SignedOut } from "../auth/helpers";
import { SignOutButton } from "../auth/buttons/signout.client";
import SignInButton from "../auth/buttons/signin";
import SignupButton from "../auth/buttons/signup";
import Container from "../layouts/container";
import UserAvatar from "../auth/avatar";

export default function Header() {
  return (
    <nav className="border-b border-b-border h-16">
      <Container>
        <div className="flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link
              href={"/"}
              className="inline-flex items-center gap-2 font-bold"
            >
              <Logo />
              Todo
            </Link>
          </div>
          <SignedIn>
            <div className="flex items-center gap-4">
              <SignOutButton variant="outline" />
              <UserAvatar />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex gap-2">
              <SignInButton />
              <SignupButton />
            </div>
          </SignedOut>
        </div>
      </Container>
    </nav>
  );
}
