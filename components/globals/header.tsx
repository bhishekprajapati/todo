import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import Logo from "./logo";

export default function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-border h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"} className="inline-flex items-center gap-2 font-bold">
            <Logo />
            Todo
          </Link>
        </div>
        <AuthButton />
      </div>
    </nav>
  );
}
