import { ReactNode } from "react";
import Providers from "./providers";

export default function AppLayout(props: { children: ReactNode }) {
  const { children } = props;
  return <Providers>{children}</Providers>;
}
