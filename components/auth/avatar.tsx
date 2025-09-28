import Avatar from "boring-avatars";
import { getCachedClaims } from "./helpers";
import { AvatarProps } from "boring-avatars/dist/components/types";

export default async function UserAvatar(
  props: Omit<AvatarProps, "name" | "colors">,
) {
  const claims = await getCachedClaims();

  if (!claims) {
    return null;
  }

  return (
    <Avatar
      name={claims.email}
      colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
      size={24}
      {...props}
    />
  );
}
