// components/payment/PaymentMethodSelector.tsx

import { PaymentMethod } from "../lib/paymentEligibility";
export type { PaymentMethod } from "../lib/paymentEligibility";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  allowedMethods: PaymentMethod[];
  codAdvancePercent?: number; // COD advance paid online upfront (default 15%)
  onlineDiscountPercent?: number;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  selectedMethod, 
  onMethodChange,
  allowedMethods,
  codAdvancePercent = 15,
  onlineDiscountPercent = 0,
}) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="mb-6 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
        Payment Method
      </h2>
      <div className="space-y-4">
        {allowedMethods.includes('ONLINE') && <div className="relative">
          {onlineDiscountPercent > 0 && (
            <div className="pointer-events-none absolute left-1/2 top-0 z-10 w-max max-w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-emerald-500 px-4 py-2 text-center text-xs font-bold text-white shadow-md sm:text-sm">
              Pay Online &amp; Get {onlineDiscountPercent}% OFF on Total Bill
            </div>
          )}
          <button
            type="button"
            aria-pressed={selectedMethod === 'ONLINE'}
            className={`w-full rounded-xl border p-5 text-left transition-all sm:p-6 ${onlineDiscountPercent > 0 ? 'pt-8 sm:pt-9' : ''} ${selectedMethod === 'ONLINE' ? 'border-indigo-500 bg-indigo-50/70 ring-1 ring-indigo-500' : 'border-gray-200 bg-white hover:border-gray-400'}`}
            onClick={() => onMethodChange('ONLINE')}
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[3px] ${selectedMethod === 'ONLINE' ? 'border-indigo-500' : 'border-slate-400'}`}>
                {selectedMethod === 'ONLINE' && <div className="h-3.5 w-3.5 rounded-full bg-indigo-500" />}
              </div>
              <div className="text-xl font-medium text-gray-950 sm:text-2xl">Online Payment (PhonePe)</div>
            </div>
            <p className="mt-4 pl-11 text-base leading-relaxed text-gray-500 sm:text-lg">Pay securely online using credit card, debit card, or UPI</p>
          </button>
        </div>}

        {allowedMethods.includes('COD') && <div className={`overflow-hidden rounded-xl border transition-all ${selectedMethod === 'COD' ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-400'}`}>
          <div className="flex items-center gap-3 border-b border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-gray-900 sm:text-base">
            <span className="text-xl text-amber-400" aria-hidden="true">★</span>
            <span>Pay {codAdvancePercent}% of the bill now, remaining on delivery</span>
          </div>
          <button
            type="button"
            aria-pressed={selectedMethod === 'COD'}
            className={`w-full p-5 text-left transition-colors sm:p-6 ${selectedMethod === 'COD' ? 'bg-indigo-50/70' : 'bg-white'}`}
            onClick={() => onMethodChange('COD')}
          >
            <div className="flex items-start gap-4">
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[3px] ${selectedMethod === 'COD' ? 'border-indigo-500' : 'border-slate-400'}`}>
                {selectedMethod === 'COD' && <div className="h-3.5 w-3.5 rounded-full bg-indigo-500" />}
              </div>
              <div className="text-xl font-medium text-gray-950 sm:text-2xl">Partial COD — Pay 15% Now and Balance on Delivery</div>
            </div>
            <p className="mt-4 pl-11 text-base leading-relaxed text-gray-500 sm:text-lg">
              Pay {codAdvancePercent}% online now — remaining {100 - codAdvancePercent}% in cash when your order is delivered
            </p>
          </button>
        </div>}

        {allowedMethods.includes('FULL_COD') && <button type="button" aria-pressed={selectedMethod === 'FULL_COD'}
          className={`w-full rounded-xl border p-5 text-left transition-all sm:p-6 ${selectedMethod === 'FULL_COD' ? 'border-indigo-500 bg-indigo-50/70 ring-1 ring-indigo-500' : 'border-gray-200 bg-white hover:border-gray-400'}`}
          onClick={() => onMethodChange('FULL_COD')}>
          <div className="flex items-center gap-4"><div className={`flex h-7 w-7 items-center justify-center rounded-full border-[3px] ${selectedMethod === 'FULL_COD' ? 'border-indigo-500' : 'border-slate-400'}`}>{selectedMethod === 'FULL_COD' && <div className="h-3.5 w-3.5 rounded-full bg-indigo-500" />}</div><div className="text-xl font-medium text-gray-950 sm:text-2xl">Cash on Delivery (COD)</div></div>
          <p className="mt-4 pl-11 text-base text-gray-500 sm:text-lg">Pay the complete order amount when your order is delivered.</p>
        </button>}
      </div>
    </section>
  );
};
