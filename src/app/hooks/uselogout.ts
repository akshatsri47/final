"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import api from "../utils/api";

export function useLogout() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const response = await api.post("/logout");

      // No need for response.ok, just check response status directly
      if (response.status === 200) {
        localStorage.removeItem("userId");
        console.log("🔓 Logged out successfully");
        router.push("/auth"); // Redirect to auth page after logout
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Error is an AxiosError
        console.error("Axios Error:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        // General JavaScript error
        console.error("General Error:", error.message);
      } else {
        console.error("Unknown Error:", error);
      }
    }
  }

  return handleLogout;
}