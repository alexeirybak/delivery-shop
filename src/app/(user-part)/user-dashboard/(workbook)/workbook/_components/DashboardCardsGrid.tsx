import { useRouter } from "next/navigation";
import { DashboardCard } from "./DashboardCard";
import { dashboardCards } from "../utils/dashboardCards";
import "../../styles/dashboard-cards-grid.css";

export const DashboardCardsGrid = () => {
  const router = useRouter();
  const navigateTo = (path: string) => {
    router.push(path);
  };
  return (
    <div className="dashboard-cards-grid">
      {dashboardCards.map((card) => (
        <DashboardCard key={card.id} card={card} navigateTo={navigateTo} />
      ))}
    </div>
  );
};
