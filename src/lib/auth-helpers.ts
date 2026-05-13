import { auth } from "./auth";

export async function getBetterAuthSession(headers: Headers) {
  try {
    return await auth.api.getSession({ headers });
  } catch (error) {
    console.log("Better-Auth session check failed:", error);
    return null;
  }
}