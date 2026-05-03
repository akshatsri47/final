export function calculatePricing(
  basePrice: number,
  prodDiscount: number = 0,
  coupDiscount: number = 0
) {
  let sellingPrice = basePrice;
  let originalPrice = basePrice;
  let displayDiscount = 0;

  if (prodDiscount > 0) {
    // basePrice IS the selling/discounted price stored in DB.
    // Recover original MRP: sellingPrice = MRP * (1 - discount/100)
    // => MRP = sellingPrice / (1 - discount/100)
    const effectiveDiscount = Math.max(prodDiscount, coupDiscount);
    displayDiscount = effectiveDiscount;
    sellingPrice = basePrice;
    originalPrice = basePrice / (1 - effectiveDiscount / 100);
  } else if (prodDiscount < 0) {
    // Legacy markup path: basePrice is the MRP; negative discount = real % off
    displayDiscount = Math.abs(prodDiscount);
    if (coupDiscount > displayDiscount) {
      displayDiscount = coupDiscount;
    }
    sellingPrice = basePrice - (basePrice * displayDiscount) / 100;
    originalPrice = basePrice;
  } else {
    // No product discount — coupon only
    if (coupDiscount > 0) {
      displayDiscount = coupDiscount;
      sellingPrice = basePrice - (basePrice * displayDiscount) / 100;
      originalPrice = basePrice;
    }
  }

  return { sellingPrice, originalPrice, displayDiscount };
}
