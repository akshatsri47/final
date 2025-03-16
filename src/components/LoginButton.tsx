"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, getIdToken } from "firebase/auth";
import { auth, googleProvider, db } from "../../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";

export default function LoginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ Perform OAuth authentication
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await getIdToken(user);

      // ✅ Store auth token and user ID securely
      Cookies.set("authToken", token, { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set("userId", user.uid, { expires: 7, secure: true, sameSite: "Strict" });
      localStorage.setItem("userId", user.uid);

      console.log("✔ User ID stored in localStorage:", user.uid);

      // ✅ Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        cart: [],
      }, { merge: true });

      console.log("User saved to Firestore:", user);

      // ✅ Redirect to home page
      router.push(`/`);
    } catch (error) {
      console.error("❌ Login Error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center pb-9">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        className={`px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Logging in...
          </>
        ) : (
          <>Login with Google</>
        )}
      </button>
    </div>
  );
}
