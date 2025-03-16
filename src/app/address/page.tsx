"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserId } from "../hooks/useId"; // Custom hook to get userId
import { Address } from "../../../types/types";
import axios from "axios";



export default function AddressPage() {
const router = useRouter()
  const userId = useUserId(); // Get userId from session or context
  const [address, setAddress] = useState<Address>({
    name:"",
    line1: "",
    line2: "",
    state: "",
    city: "",
    zip: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch the existing address when the component loads
  useEffect(() => {
    if (!userId) return;

    const fetchAddress = async () => {
      try {
        const response = await axios.get(`/api/address?userId=${userId}`);
        if (response.data.success && response.data.data) {
          setAddress(response.data.data); // Autofill address
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [userId]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to update the address
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    try {
       await axios.put("/api/address", { userId, address });
      alert("Address updated successfully!");
      router.push("/order")
      
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center text-lg py-10">Loading address...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Your Address</h1>
      <form onSubmit={handleSave} className="space-y-4">
      <input
          type="text"
          name="name"
          placeholder="Your name"
          value={address.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="line1"
          placeholder="Address Line 1"
          value={address.line1}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="line2"
          placeholder="Address Line 2 (Optional)"
          value={address.line2 || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={address.state}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="zip"
          placeholder="ZIP Code"
          value={address.zip}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={address.phone}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Address"}
        </button>
      </form>
    </div>
  );
}
