import { useState } from "react";

export const useQuantity = () => {
  const [quantity, setQuantity] = useState<number>(1);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return { quantity, increaseQuantity, decreaseQuantity };
};
