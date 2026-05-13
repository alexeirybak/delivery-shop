import { getBetterAuthSession } from "@/lib/auth-helpers";

export async function getAuthenticatedUserId(
  headers: Headers,
): Promise<string> {
  const session = await getBetterAuthSession(headers);

  if (!session?.user?.id) {
    throw new Error("Не авторизован");
  }

  return session.user.id;
}
