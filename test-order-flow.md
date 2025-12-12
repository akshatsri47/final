# Order Flow Testing Guide

## 🧪 Testing COD vs Online Payment Flow

### COD Order Flow (Fixed)
1. **Order Page** → Select "COD" payment method
2. **Click "Place Order"** → Calls `handleCODOrder()`
3. **Creates order** in database first
4. **Creates Shiprocket order** with COD method
5. **Redirects to** `/order-confirmation?orderId=XXX&paymentMethod=COD`
6. **Order Confirmation** → Skips PhonePe verification, shows COD success

### Online Payment Flow
1. **Order Page** → Select "ONLINE" payment method  
2. **Click "Place Order"** → Calls `handleOnlinePayment()`
3. **Creates order** in database first
4. **Redirects to PhonePe** payment gateway
5. **After payment** → PhonePe redirects to `/order-confirmation?orderId=XXX`
6. **Order Confirmation** → Verifies PhonePe payment, then creates Shiprocket order

## 🔍 Key Changes Made

### 1. Order Page (`src/app/order/page.tsx`)
- ✅ COD orders now create database order first
- ✅ COD orders pass `paymentMethod=COD` in URL
- ✅ Both flows create order before proceeding
- ✅ Added proper error handling and user feedback

### 2. Order Confirmation (`src/app/order-confirmation/page.tsx`)
- ✅ Detects payment method from URL parameters
- ✅ COD orders skip PhonePe verification completely
- ✅ Online orders still verify payment before proceeding
- ✅ Different success messages for COD vs Online

### 3. Flow Separation
```
COD Flow:
Order Page → Create DB Order → Create Shiprocket → Confirmation (No PhonePe)

Online Flow:  
Order Page → Create DB Order → PhonePe Payment → Verification → Shiprocket → Confirmation
```

## 🧪 Testing Steps

### Test COD Order:
1. Add items to cart
2. Go to `/order` page
3. Select "COD" payment method
4. Click "Place Order"
5. **Expected**: Direct success without PhonePe verification

### Test Online Order:
1. Add items to cart  
2. Go to `/order` page
3. Select "ONLINE" payment method
4. Click "Place Order"
5. **Expected**: Redirect to PhonePe, then verification on return

## 🐛 Debug Points

### Check Terminal for:
- ✅ "Order created for COD: [orderId]"
- ✅ "Processing COD order confirmation"
- ✅ "Verifying online payment for order: [orderId]"

### Check Browser Console for:
- ✅ Payment method detection
- ✅ Order creation success
- ✅ Redirect URLs

### Check URL Parameters:
- COD: `/order-confirmation?orderId=XXX&paymentMethod=COD`
- Online: `/order-confirmation?orderId=XXX` (no paymentMethod)

## ✅ Expected Results

### COD Orders:
- ❌ Should NOT call `/api/verifyOrder/[id]`
- ✅ Should show "COD order confirmed" message
- ✅ Should show "Payment will be collected upon delivery"

### Online Orders:
- ✅ Should call `/api/verifyOrder/[id]` 
- ✅ Should verify PhonePe payment status
- ✅ Should show "Payment successful" message