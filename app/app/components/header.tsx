import Container from "@/components/layouts/container";
import { UserAvatarMenu } from "./user-avatar";
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
          <UserAvatarMenu />
        </nav>
      </Container>
    </div>
  );
}
