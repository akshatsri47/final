# Order Flow Testing Guide

## 🧪 Testing COD (Split Payment) vs Online Payment Flow

### COD Order Flow — 15% online advance + 85% on delivery
1. **Order Page** → Select "COD" payment method
2. **Click "Place Order (COD · Pay ₹X now)"** → Calls `handleCODOrder()`
3. **Creates order** in database with `paymentMethod: "COD"`, `codAdvanceAmount` (15%), `codDueAmount` (85%)
4. **Redirects to PhonePe** to collect the 15% advance
5. **After payment** → PhonePe redirects to `/order-confirmation?orderId=XXX`
6. **Order Confirmation** → Fetches the order (detects COD from Firestore), verifies the advance payment with PhonePe, then creates the Shiprocket order — the courier collects only the 85% due amount

### Online Payment Flow
1. **Order Page** → Select "ONLINE" payment method
2. **Click "Place Order"** → Calls `handleOnlinePayment()`
3. **Creates order** in database first (full amount)
4. **Redirects to PhonePe** payment gateway (full amount)
5. **After payment** → PhonePe redirects to `/order-confirmation?orderId=XXX`
6. **Order Confirmation** → Verifies PhonePe payment, then creates the Shiprocket order (Prepaid)

## 🔍 Key Implementation Details

### 1. Order Page (`src/app/order/page.tsx`)
- ✅ Both flows create the database order first
- ✅ COD orders pay only the 15% advance online via PhonePe
- ✅ Button shows the advance amount: `Place Order (COD · Pay ₹X now)`
- ✅ No COD surcharge — the order total equals the cart subtotal

### 2. Order API (`src/app/api/order/route.ts`)
- ✅ Stores `codAdvanceAmount` / `codDueAmount` on COD orders
- ✅ Still rejects COD when a cart item has `codAvailable === false`

### 3. Order Confirmation (`src/app/order-confirmation/page.tsx`)
- ✅ Fetches the order doc to detect the payment method (PhonePe's redirect carries no method)
- ✅ Verifies the PhonePe payment for BOTH methods (for COD this is the 15% advance)
- ✅ No successful payment → no Shiprocket shipment; status set to "Payment Failed"
- ✅ COD success message: "₹X paid online. Please keep ₹Y ready — collected on delivery"

### 4. Shiprocket (`src/app/api/ship/route.ts`)
- ✅ COD shipments apply the prepaid advance as `total_discount`
- ✅ Courier's collectable amount = subtotal − advance = the 85% due amount
- ✅ No "COD Fee" line item anymore

### 5. Flow Overview
```
COD Flow:
Order Page → Create DB Order → PhonePe (15% advance) → Verification → Shiprocket (85% collectable) → Confirmation

Online Flow:
Order Page → Create DB Order → PhonePe (100%) → Verification → Shiprocket (Prepaid) → Confirmation
```

## 🧪 Testing Steps

### Test COD Order (₹100 cart example):
1. Add items to cart (₹100)
2. Go to `/order` page
3. Select "COD" payment method
4. Cart summary shows "Pay online now (15%): ₹15" and "Pay on delivery (85%): ₹85"
5. Click "Place Order (COD · Pay ₹15 now)"
6. **Expected**: Redirect to PhonePe for ₹15
7. Complete the payment
8. **Expected**: Confirmation shows "₹15 paid online. Please keep ₹85 ready..."
9. **Expected**: Order status becomes "COD Advance Paid - Ready to Ship"
10. **Expected**: Shiprocket shipment created as COD with ₹85 collectable

### Test COD payment failure / abandoned:
1. Same steps, but fail or close the PhonePe payment
2. **Expected**: No shipment created; order status "Payment Failed"

### Test Online Order:
1. Add items to cart
2. Go to `/order` page
3. Select "ONLINE" payment method
4. Click "Place Order"
5. **Expected**: Redirect to PhonePe for the full amount, then verification on return

## 🐛 Debug Points

### Check Terminal for:
- ✅ "Order created for COD: [orderId]"
- ✅ "Redirecting to PhonePe for COD advance payment: [url]"
- ✅ "Verifying payment for order: [orderId]"

### Check Browser Console for:
- ✅ Order creation success
- ✅ Redirect URLs

### Check URL Parameters:
- Both flows: `/order-confirmation?orderId=XXX` (the method is read from the order doc)

## ✅ Expected Results

### COD Orders:
- ✅ PhonePe charge = 15% of the cart total only
- ✅ Should call `/api/verifyOrder/[id]` (advance verification)
- ✅ Should show "₹X paid online. Please keep ₹Y ready..."
- ✅ Shiprocket collectable amount = 85% of the cart total
- ✅ No COD fee anywhere — the total equals the cart subtotal

### Online Orders:
- ✅ Should call `/api/verifyOrder/[id]`
- ✅ Should verify PhonePe payment status
- ✅ Should show "Payment successful" message
