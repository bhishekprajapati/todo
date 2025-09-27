"use client";

import { createClient } from "@/lib/supabase/client";
import { Button, ButtonProps } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { withBase } from "@/utils/auth";
import config from "@/config";

type TSignOutButtonProps = Omit<ButtonProps, "onClick">;

export function SignOutButton(props: TSignOutButtonProps) {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(withBase(config.auth.pages.signin.name));
  };

  return (
    <Button onClick={signOut} {...props}>
      <LogOut size={16} />
      Signout
    </Button>
  );
}
