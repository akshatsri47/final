// components/payment/PaymentMethodSelector.tsx

export type PaymentMethod = 'ONLINE' | 'COD';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  selectedMethod, 
  onMethodChange 
}) => {
  return (
    <div className="border p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Payment Method
      </h2>
      <div className="space-y-4">
        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'ONLINE' ? 'border-indigo-500 bg-indigo-50' : 'hover:border-gray-400'}`}
          onClick={() => onMethodChange('ONLINE')}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'ONLINE' ? 'border-indigo-500' : 'border-gray-400'}`}>
              {selectedMethod === 'ONLINE' && <div className="w-3 h-3 rounded-full bg-indigo-500"></div>}
            </div>
            <div className="font-medium">Online Payment (PhonePe)</div>
          </div>
          <p className="text-sm text-gray-500 mt-2 ml-8">Pay securely online using credit card, debit card, or UPI</p>
        </div>
        
        <div 
          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedMethod === 'COD' ? 'border-indigo-500 bg-indigo-50' : 'hover:border-gray-400'}`}
          onClick={() => onMethodChange('COD')}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'COD' ? 'border-indigo-500' : 'border-gray-400'}`}>
              {selectedMethod === 'COD' && <div className="w-3 h-3 rounded-full bg-indigo-500"></div>}
            </div>
            <div className="font-medium">Cash on Delivery (COD)</div>
          </div>
          <p className="text-sm text-gray-500 mt-2 ml-8">Pay with cash when your order is delivered</p>
        </div>
      </div>
    </div>
  );
};