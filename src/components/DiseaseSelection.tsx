import React from "react";
import { Disease } from "../../types/types";
import Image from "next/image";
interface DiseaseSelectionProps {
  diseases: Disease[];
  onSelectDisease: (diseaseId: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const DiseaseSelection: React.FC<DiseaseSelectionProps> = ({ diseases, onSelectDisease, onBack, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Select the Disease</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {diseases.map((disease) => (
          <button
            key={disease.id}
            onClick={() => onSelectDisease(disease.id)}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="w-32 h-32 overflow-hidden mb-2">
            <Image 
                src={disease.imageUrl} 
                alt={disease.name} 
                width={128} 
                height={128} 
                className="w-full h-full object-cover rounded-md"
                priority
              />
            </div>
            <span className="font-medium text-gray-800">{disease.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Crops
        </button>
      </div>
    </div>
  );
};

export default DiseaseSelection;
