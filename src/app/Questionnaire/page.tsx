"use client";
import React, { useEffect, useState } from "react";
import CropSelection from "../../components/CropSelection";
import DiseaseSelection from "../../components/DiseaseSelection";
import ProductRecommendation from "../../components/Questionnaire";
import { fetchCrops, fetchDiseasesByCrop, fetchRecommendedProducts } from "../../lib/query";
import { Crop, Disease, Product } from "../../../types/types";

const App: React.FC = () => {
  const [step, setStep] = useState<"crops" | "diseases" | "products">("crops");
  const [crops, setCrops] = useState<Crop[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const setSelectedDiseaseId = useState<string | null>(null)[1];
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const loadCrops = async () => {
      setIsLoading(true);
      try {
        const cropsData = await fetchCrops();
        setCrops(cropsData);
      } catch (error) {
        console.error("Error fetching crops:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCrops();
  }, []);

  const handleSelectCrop = async (cropId: string) => {
    setSelectedCropId(cropId);
    setIsLoading(true);
    try {
      const diseasesData = await fetchDiseasesByCrop(cropId);
      setDiseases(diseasesData);
      setStep("diseases");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDisease = async (diseaseId: string) => {
    setSelectedDiseaseId(diseaseId);
    setIsLoading(true);
    try {
      if (selectedCropId) {
        const productsData = await fetchRecommendedProducts(selectedCropId, diseaseId);
        setProducts(productsData);
        setStep("products");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-700">FertilizeRight</h1>
        <p className="text-gray-600">Find the perfect fertilizer for your crops</p>
      </header>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {step === "crops" ? (
          <CropSelection crops={crops} onSelectCrop={handleSelectCrop} isLoading={isLoading} />
        ) : step === "diseases" ? (
          <DiseaseSelection 
            diseases={diseases} 
            onSelectDisease={handleSelectDisease} 
            onBack={() => setStep("crops")} 
            isLoading={isLoading} 
          />
        ) : (
          <ProductRecommendation products={products} onBack={() => setStep("crops")} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default App;
