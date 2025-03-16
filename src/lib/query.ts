import axios from "axios";
import { Crop, Disease, Product, Recommendation } from "../../types/types";

// ✅ Ensure Base URL is Correct


/**
 * Fetch all crops from the API.
 */
export const fetchCrops = async (): Promise<Crop[]> => {
  const res = await axios.get("/api/question/crop");
  return res.data;
};

/**
 * Fetch diseases based on the selected crop.
 */
export const fetchDiseasesByCrop = async (cropId: string): Promise<Disease[]> => {
  const res = await axios.get("/api/question/disease?cropId=${cropId}");
  return res.data;
};

/**
 * Fetch full product details by ID.
 */
export const fetchProductById = async (productId: string): Promise<Product | null> => {
  try {
    const res = await axios.get("/api/product/${productId}");
    if (res.data.success) {
      return res.data.data;
    } else {
      console.error(`❌ Product not found: ${productId}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error fetching product ${productId}:`, error);
    return null;
  }
};

/**
 * Fetch recommended products for a selected crop and disease.
 */
export const fetchRecommendedProducts = async (cropId: string, diseaseId: string): Promise<Product[]> => { 
  try {
    // Fetch recommended product IDs
    const res = await axios.get("/api/question/recommendation?cropId=${cropId}&diseaseId=${diseaseId}");
    const recommendations: Recommendation[] = res.data;

    if (recommendations.length === 0) {
      console.warn("⚠ No product recommendations found.");
      return [];
    }

    const productIds = recommendations[0].productIds;
    console.log(productIds) // Assuming one recommendation per crop-disease

    console.log("📢 Product IDs from recommendation:", productIds);

    // ✅ Fetch full product details for each productId
    const productDetails = await Promise.all(
      productIds.map(async (id) => {
        const product = await fetchProductById(id);
        if (!product) console.warn(`⚠ Skipping missing product: ${id}`);
        return product;
      })
    );

    // Filter out null values
    return productDetails.filter((product): product is Product => product !== null);
  } catch (error) {
    console.error(`❌ Error fetching recommended products for cropId=${cropId} & diseaseId=${diseaseId}:`, error);
    return [];
  }
};

