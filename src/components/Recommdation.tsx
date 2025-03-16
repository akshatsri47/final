import { useEffect, useState } from "react";

type RecommendationProps = {
  crop: string | null;
  service: string | null;
  growthStage: string | null;
};

const Recommendation: React.FC<RecommendationProps> = ({ crop, service, growthStage }) => {
  const [recommendation, setRecommendation] = useState<string>("");

  useEffect(() => {
    if (crop && service) {
      fetch(`/api/recommendations?crop=${crop}&service=${service}&growthStage=${growthStage}`)
        .then((res) => res.json())
        .then((data) => setRecommendation(data.recommendation));
    }
  }, [crop, service, growthStage]);

  if (!recommendation) return null;

  return (
    <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500">
      <p className="text-gray-800 font-semibold">Recommendation:</p>
      <p className="text-gray-700">{recommendation}</p>
    </div>
  );
};

export default Recommendation;
