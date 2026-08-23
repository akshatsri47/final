export const COD_ADVANCE_PERCENT = 15;
export const FULL_COD_MAX_ORDER_VALUE = 500;
export const FULL_PREPAID_DISCOUNT_PERCENT = 3;

export type PaymentMethod = "ONLINE" | "COD" | "FULL_COD";
export type ProductPaymentEligibility =
  | "FULL_COD_ALLOWED"
  | "PARTIAL_COD_ONLY"
  | "PREPAID_ONLY"
  | "FULL_COD_AND_PREPAID"
  | "PARTIAL_COD_AND_PREPAID";

export function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function normalizePaymentEligibility(
  value?: string,
  codAvailable: boolean = true,
): ProductPaymentEligibility {
  const valid: ProductPaymentEligibility[] = [
    "FULL_COD_ALLOWED", "PARTIAL_COD_ONLY", "PREPAID_ONLY",
    "FULL_COD_AND_PREPAID", "PARTIAL_COD_AND_PREPAID",
  ];
  if (valid.includes(value as ProductPaymentEligibility)) return value as ProductPaymentEligibility;
  return codAvailable === false ? "PREPAID_ONLY" : "PARTIAL_COD_AND_PREPAID";
}

export function resolveCartPaymentRules(
  items: Array<{ paymentEligibility?: string; codAvailable?: boolean }>,
  finalOrderValue: number,
) {
  const eligibility = items.map((item) =>
    normalizePaymentEligibility(item.paymentEligibility, item.codAvailable !== false),
  );
  if (eligibility.includes("PREPAID_ONLY")) {
    return { allowedMethods: ["ONLINE"] as PaymentMethod[], restriction: "PREPAID_ONLY" as ProductPaymentEligibility };
  }

  const allAllowPrepaid = eligibility.every((item) =>
    item === "FULL_COD_AND_PREPAID" || item === "PARTIAL_COD_AND_PREPAID",
  );
  const partialRequired = eligibility.some((item) =>
    item === "PARTIAL_COD_ONLY" || item === "PARTIAL_COD_AND_PREPAID",
  );

  if (partialRequired || finalOrderValue > FULL_COD_MAX_ORDER_VALUE) {
    return {
      allowedMethods: (allAllowPrepaid ? ["ONLINE", "COD"] : ["COD"]) as PaymentMethod[],
      restriction: (allAllowPrepaid ? "PARTIAL_COD_AND_PREPAID" : "PARTIAL_COD_ONLY") as ProductPaymentEligibility,
    };
  }

  return {
    allowedMethods: (allAllowPrepaid ? ["ONLINE", "FULL_COD"] : ["FULL_COD"]) as PaymentMethod[],
    restriction: (allAllowPrepaid ? "FULL_COD_AND_PREPAID" : "FULL_COD_ALLOWED") as ProductPaymentEligibility,
  };
}
