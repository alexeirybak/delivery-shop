import { CheckCircle2 } from "lucide-react";

export const SEORecommendations = ({
  recommendations,
}: {
  recommendations: string[];
}) => {
  return (
    <div className="mt-6 p-4 bg-green-50 rounded-lg">
      <h3 className="font-semibold text-green-800 mb-2">
        Рекомендации по SEO:
      </h3>
      <ul className="text-sm text-green-700 space-y-2">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <span>{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
