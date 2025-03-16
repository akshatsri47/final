import { useEffect, useState } from "react";

export const useUserId = () => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId") ?? "";
      setUserId(storedUserId);
    }
  }, []);

  return userId;
};
