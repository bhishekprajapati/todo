import UserAvatar from "@/components/auth/avatar";
import Container from "@/components/layouts/container";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";

type TAppHeaderProps = {
  startContent?: ReactNode;
};

export default function AppHeader(props: TAppHeaderProps) {
  const { startContent } = props;

  return (
    <div className="py-4 border-b border-b-border">
      <Container>
        <nav className="flex justify-between items-center">
          {startContent}

          <span className="ms-auto" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-gray-900"
              >
                <UserAvatar size={48} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </Container>
    </div>
  );
}
