import Container from "@/components/layouts/container";
import AppHeader from "./components/header";
import Logo from "@/components/globals/logo";
import { UserTasks } from "./components/task-view";

export default function AppPage() {
  return (
    <div>
      <div className="sticky top-0 z-50 shadow bg-background/95 backdrop-blur-lg">
        <AppHeader startContent={<Logo />} />
      </div>
      <div className="py-4">
        <Container>
          <UserTasks />
        </Container>
      </div>
    </div>
  );
}
