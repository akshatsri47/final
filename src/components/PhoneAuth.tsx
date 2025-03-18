"use client";
import { useState, useEffect } from "react";
import { auth, signInWithPhoneNumber } from "../../utils/firebase";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const db = getFirestore();

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

// Define interface for Firebase error type
interface FirebaseErrorType {
  code: string;
  message: string;
}

export default function PhoneAuth() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP verification
  const [countdown, setCountdown] = useState(0);
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  // Check if user is already logged in and notify + redirect if so
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setAlreadyLoggedIn(true);
      setSuccess("You are already logged in. Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 3000); // Redirect after 3 seconds
    }
  }, [router]);

  // Auto-refresh the screen if an error occurs
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 5000); // Refresh after 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [error]);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 0) {
      if (!value.startsWith("+")) {
        setPhone("+" + value);
      } else {
        setPhone(value);
      }
    } else {
      setPhone("");
    }
  };

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => console.log("reCAPTCHA verified"),
    });
  };

  const sendOtp = async () => {
    if (!phone || phone.length < 8) {
      setError("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setSuccess("OTP sent successfully! Check your phone.");
      setStep(2); // Move to OTP verification step
      setCountdown(60); // Start 60 seconds countdown for resend
    } catch (error: unknown) {
      console.error("OTP sending failed:", error);
      const errorMessage = isFirebaseError(error)
        ? error.message
        : "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) return;
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await confirmationResult.confirm(otp);
      console.log("User verified:", result.user);
      const userId = result.user.uid;
      localStorage.setItem("userId", userId);
      const newUser = {
        id: userId,
        email: result.user.email || null,
        name: result.user.displayName || "Anonymous",
        cart: [],
        createdAt: new Date().toISOString(),
        phone: result.user.phoneNumber,
      };
      await setDoc(doc(db, "users", userId), newUser, { merge: true });
      setSuccess("Verification successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error: unknown) {
      console.error("OTP verification failed:", error);
      const errorMessage = isFirebaseError(error)
        ? error.message
        : "Invalid OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Type guard for Firebase errors
  const isFirebaseError = (error: unknown): error is FirebaseErrorType => {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      "message" in error
    );
  };

  const resetAndGoBack = () => {
    setStep(1);
    setError("");
    setSuccess("");
    setOtp("");
  };

  // If user is already logged in, show notification only
  if (alreadyLoggedIn) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Phone Authentication
        </h2>
        {success && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <p className="text-sm">{success}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Phone Authentication
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          <p className="text-sm">{success}</p>
        </div>
      )}
      {step === 1 ? (
        /* Step 1: Phone Input */
        <div className="space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full p-4 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div className="absolute left-3 top-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.540l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Enter your phone number with country code
            </p>
          </div>
          <button
            onClick={sendOtp}
            disabled={loading || !phone}
            className={`w-full p-4 rounded-lg text-white font-medium transition ${
              loading || !phone
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send Verification Code"
            )}
          </button>
        </div>
      ) : (
        /* Step 2: OTP Verification */
        <div className="space-y-4">
          <div>
            <div className="flex justify-between">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <span className="text-sm text-gray-500">Sent to {phone}</span>
            </div>
            <div className="relative">
              <input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full p-4 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition text-lg tracking-widest font-mono"
                maxLength={6}
              />
              <div className="absolute left-3 top-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <button
            onClick={verifyOtp}
            disabled={loading || otp.length < 6}
            className={`w-full p-4 rounded-lg text-white font-medium transition ${
              loading || otp.length < 6
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Code"
            )}
          </button>
          <div className="flex justify-between items-center text-sm">
            <button onClick={resetAndGoBack} className="text-gray-600 hover:text-gray-800">
              Change number
            </button>
            <button
              onClick={sendOtp}
              disabled={countdown > 0 || loading}
              className={`text-blue-600 hover:text-blue-800 ${countdown > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
            </button>
          </div>
        </div>
      )}
      {/* reCAPTCHA */}
      <div id="recaptcha-container" className="mt-4"></div>
    </div>
  );
}
