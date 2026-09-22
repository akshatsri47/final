"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  manufacturer: string;
  composition: string;
  commonlyUsedFor: string[];
  avoidForCrops: string[];
  benefits: string[];
  method: string;
  dosage: { dose: string; arce: string }[];
  pricing: { packageSize: string; price: number }[];
  images: File[];
  stickerImage: File | null;
  stickerLabel: string;
  trustedFarmers: string;
  rating: number;
  verifiedReviewsCount: number;
  reviews: ProductReview[];
}

interface ProductReview {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductForm() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    manufacturer: "",
    composition: "",
    commonlyUsedFor: [],
    avoidForCrops: [],
    benefits: [],
    method: "",
    dosage: [],
    pricing: [],
    images: [],
    stickerImage: null,
    stickerLabel: "TOP SELLER",
    trustedFarmers: "638+",
    rating: 4.6,
    verifiedReviewsCount: 148,
    reviews: []
  });

  const [pricing, setPricing] = useState<{ packageSize: string; price: number }>({
    packageSize: "",
    price: 0,
  });

  const [dose, setDose] = useState<{ dose: string; arce: string }>({
    dose: "",
    arce: "",
  });
  const [review, setReview] = useState<ProductReview>({
    name: "",
    rating: 5,
    comment: "",
    date: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleArrayChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value.split(",").map((item) => item.trim()),
  //   });
  // };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  const handleStickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, stickerImage: e.target.files?.[0] || null });
  };

  const handlePricingChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPricing({ ...pricing, [e.target.name]: e.target.value });
  };

  const handleDoseChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDose({ ...dose, [e.target.name]: e.target.value });
  };

  const handleReviewChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const addPricing = () => {
    setFormData({ ...formData, pricing: [...formData.pricing, pricing] });
    setPricing({ packageSize: "", price: 0 });
  };

  const addDose = () => {
    setFormData({ ...formData, dosage: [...formData.dosage, dose] });
    setDose({ dose: "", arce: "" });
  };

  const addReview = () => {
    if (!review.name || !review.comment) return;
    setFormData({
      ...formData,
      reviews: [...formData.reviews, { ...review, rating: Number(review.rating) }],
    });
    setReview({ name: "", rating: 5, comment: "", date: "" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((image: File) => data.append("images", image));
        } else if (key === "stickerImage" && value instanceof File) {
          data.append("stickerImage", value);
        } else if (key === "stickerImage") {
          return;
        } else if (Array.isArray(value) || typeof value === 'object') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value as string);
        }
      });

      await axios.post("/api/product", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/product");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Failed to add product");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {Object.keys(formData).map((field) =>
        field !== "images" &&
        field !== "stickerImage" &&
        field !== "pricing" &&
        field !== "dosage" &&
        field !== "reviews" ? (
          <input
            key={field}
            name={field}
            type={field === "rating" || field === "verifiedReviewsCount" ? "number" : "text"}
            placeholder={field}
            className="border p-2"
            onChange={handleChange}
            value={String(formData[field as keyof ProductFormData] || "")}
          />
        ) : null
      )}

      <input
        type="file"
        multiple
        accept="image/*"
        className="border p-2"
        onChange={handleImageChange}
      />

      <input
        type="file"
        accept="image/*"
        className="border p-2"
        onChange={handleStickerChange}
      />

      <div className="flex gap-2">
        <input
          name="packageSize"
          type="text"
          placeholder="Package Size"
          className="border p-2"
          onChange={handlePricingChange}
          value={pricing.packageSize}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          className="border p-2"
          onChange={handlePricingChange}
          value={pricing.price}
        />
        <button
          type="button"
          className="btn bg-blue-500 text-white p-2 rounded"
          onClick={addPricing}
        >
          Add Pricing
        </button>
      </div>

      <div className="flex flex-col gap-2 border p-3">
        <p className="font-semibold">Add Review</p>
        <input
          name="name"
          type="text"
          placeholder="Reviewer Name"
          className="border p-2"
          onChange={handleReviewChange}
          value={review.name}
        />
        <input
          name="rating"
          type="number"
          placeholder="Rating"
          className="border p-2"
          min={1}
          max={5}
          step={0.1}
          onChange={handleReviewChange}
          value={review.rating}
        />
        <textarea
          name="comment"
          placeholder="Review"
          className="border p-2"
          onChange={handleReviewChange}
          value={review.comment}
        />
        <input
          name="date"
          type="text"
          placeholder="Date"
          className="border p-2"
          onChange={handleReviewChange}
          value={review.date}
        />
        <button
          type="button"
          className="btn bg-blue-500 text-white p-2 rounded"
          onClick={addReview}
        >
          Add Review
        </button>
      </div>

      <div className="flex gap-2">
        <input
          name="dose"
          type="text"
          placeholder="Dose"
          className="border p-2"
          onChange={handleDoseChange}
          value={dose.dose}
        />
        <input
          name="arce"
          type="text"
          placeholder="Arce"
          className="border p-2"
          onChange={handleDoseChange}
          value={dose.arce}
        />
        <button
          type="button"
          className="btn bg-blue-500 text-white p-2 rounded"
          onClick={addDose}
        >
          Add Dose
        </button>
      </div>

      <button
        type="submit"
        className="btn bg-green-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
