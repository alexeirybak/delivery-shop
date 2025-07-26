import { headers } from "next/headers";
import { auth } from "../../../utils/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }
  return <div>Профиль</div>;
};

export default DashboardPage;
