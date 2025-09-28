"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function useClient() {
  const [client] = useState(() => createClient());
  return client;
}
