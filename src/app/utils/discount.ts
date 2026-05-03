export function calculatePricing(
  basePrice: number,
  prodDiscount: number = 0,
  coupDiscount: number = 0
) {
  let sellingPrice = basePrice;
  let originalPrice = basePrice;
  let displayDiscount = 0;

  if (prodDiscount < 0) {
    displayDiscount = Math.abs(prodDiscount);
    if (coupDiscount > displayDiscount) {
      displayDiscount = coupDiscount;
    }
    sellingPrice = basePrice - (basePrice * displayDiscount) / 100;
    originalPrice = basePrice; // Original price stays at base price
  } else if (prodDiscount > 0) {
    displayDiscount = prodDiscount;
    sellingPrice = basePrice;
    originalPrice = basePrice + (basePrice * displayDiscount) / 100; // Inflate to show markup as a discount
  } else {
    if (coupDiscount > 0) {
      displayDiscount = coupDiscount;
      sellingPrice = basePrice - (basePrice * displayDiscount) / 100;
      originalPrice = basePrice;
    }
  }

  return { sellingPrice, originalPrice, displayDiscount };
}
