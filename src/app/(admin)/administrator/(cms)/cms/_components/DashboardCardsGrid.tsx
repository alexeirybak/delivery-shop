import { useRouter } from "next/navigation";
import DashboardCard from "./DashboardCard";
import { dashboardCards } from "../utils/dashboardCards";

const DashboardCardsGrid = () => {
    
  const router = useRouter();
  const navigateTo = (path: string) => {
    router.push(path);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {dashboardCards.map((card) => (
        <DashboardCard key={card.id} card={card} navigateTo={navigateTo} />
      ))}
    </div>
  );
};

export default DashboardCardsGrid;
