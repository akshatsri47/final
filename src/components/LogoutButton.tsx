"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

    async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("userId");
      console.log("🔓 Logged out");
      
    router.push("/cart"); // Redirect to login
  }

  return (
    <button
      onClick={handleLogout}
    >
      
    </button>
  );
}
