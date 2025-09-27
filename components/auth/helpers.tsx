import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getCachedSupabaseClient = cache(async () => createClient());

export const getCachedClaims = cache(async () => {
  const client = await getCachedSupabaseClient();
  const claims = await client.auth.getClaims();
  return claims.data?.claims ? claims.data.claims : null;
});

export const getIsSignedIn = cache(async () => {
  return Boolean(await getCachedClaims());
});

type TSignedInProps = {
  children: React.ReactNode;
};

export async function SignedIn(props: TSignedInProps) {
  const { children } = props;
  const isSignedIn = await getIsSignedIn();
  return isSignedIn ? children : null;
}

type TSignedOutProps = {
  children: React.ReactNode;
};

export async function SignedOut(props: TSignedOutProps) {
  const { children } = props;
  const isSignedIn = await getIsSignedIn();
  return !isSignedIn ? children : null;
}
