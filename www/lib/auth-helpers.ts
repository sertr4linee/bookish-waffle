import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSessionOrThrow() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getSessionOrNull() {
  return auth.api.getSession({
    headers: await headers(),
  });
}
