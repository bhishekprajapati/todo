import config from "@/config";

export const withBase = (name: string) => `/${config.auth.base}/${name}`;
