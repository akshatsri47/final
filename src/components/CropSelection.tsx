import React from "react";
import { Crop } from "../../types/types";
import Image from "next/image";
interface CropSelectionProps {
  crops: Crop[];
  onSelectCrop: (cropId: string) => void;
  isLoading: boolean;
}

const CropSelection: React.FC<CropSelectionProps> = ({ crops, onSelectCrop, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Select Your Crop</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {crops.map((crop) => (
          <button
            key={crop.id}
            onClick={() => onSelectCrop(crop.id)}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="w-32 h-32 overflow-hidden mb-2">
            <Image 
                src={crop.imageUrl} 
                alt={crop.name} 
                width={128} 
                height={128} 
                className="w-full h-full object-cover rounded-md"
                priority
              />
            </div>
            <span className="font-medium text-gray-800">{crop.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CropSelection;
