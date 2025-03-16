
    // export interface Product {
    //   id: string;         // Firestore-generated Product ID
    //   name: string;       // Product Name
    //   description: string;// Product Description
    //   pricing: Pricing[]; // Price of the Product
    //   category: string;   // Category (e.g., Electronics, Clothing)
    //   stock: number;      // Available Stock
    //   images: string[];   // Array of image URLs
    //   createdAt: string;  // Timestamp of product creation
    // }

    export interface Product {
      id: string;                 // Firestore-generated Product ID
      name: string;               // Product Name (e.g., 'Bayer Evergol Xtend')
      description: string;        // Detailed Product Description          
      category: string;           // Category (e.g., 'Seed Treatment')
      pricing:Pricing[];
      images: string[];           // Array of image URLs
      createdAt: string;          // Timestamp of product creation
      manufacturer: string;       // Manufacturer Name (e.g., 'Bayer Crop Science')
      composition: string;        // Composition / Technical details
      commonlyUsedFor: string[];  // List of crops commonly used for (e.g., ['corn', 'soybean', 'cereals', 'pulses', 'rice'])
      avoidForCrops: string[]; 
      search?:string;
      keywords?:string[];  // Crops to avoid usage (e.g., ['wheat', 'hybrid seed'])
      dosage: {
        method: string; // e.g., "mix Vitavax 3Grams..."
        dosage: Array<{
          arce: string; // e.g., "50 Kg Seed"
          dose: string; // e.g., "100 gm"
        }>;
      };
      benefits: string[];  
      discount?:number
          // List of product benefits
    }
 
    export interface Pricing{
      price:number,
      packageSize:string
    }

    export interface User {
      id: string;         // Firestore-generated User ID
      email: string;      // User Email
      name: string;       // User Name
      password: string;   // Hashed Password (should be hashed before storing)
      address: Address[];
      cart: CartItem[];   // Array of Cart Items
    }
     export interface ProductFormData {
      name: string;
      description: string;
      category: string;
      manufacturer: string;
      composition: string;
      commonlyUsedFor: string[];
      avoidForCrops: string[];
      benefits: string[];
      method: string;
      dosage: { dose: string; arce: string }[];
      pricing: { packageSize: string; price: number }[];
      images: File[];
    }
    
  
    export interface CartItem {
      name: string;
      productId?: string;
      images?: string | string[];
      packageSize?: string;
      quantity: number;
      price: number;
      addedAt: string | number | Date;
    }
    
  
  export interface Order {
    id: string;         // Firestore-generated Order ID
    userId: string;     // ID of the user who placed the order
    items: CartItem[];  // Array of ordered items
    totalAmount: number;// Total price of the order
    status: "pending" | "processing" | "shipped" | "delivered"; // Order status
    shiprocketTrackingId?: string;
    createdAt: string;  // Timestamp of order creation
  }
  
  
  export interface Payment {
    id: string;         // Firestore-generated Payment ID
    orderId: string;    // ID of the related order
    amount: number;     // Total payment amount
    status: "pending" | "completed" | "failed"; // Payment status
    createdAt: string;  // Timestamp of payment
  }
  
  
  export interface Review {
    id: string;         // Firestore-generated Review ID
    userId: string;     // ID of the user who left the review
    productId: string;  // ID of the reviewed product
    rating: number;     // Rating (1-5)
    comment: string;    // Review comment
    createdAt: string;  // Timestamp of review submission
  }
  
  export interface Address {
    name:string,
    line1: string;
    line2?: string;
    state: string;
    city: string;
    zip: string;
    phone: string;
}  
export interface Crop {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Disease {
  id: string;
  name: string;
  imageUrl: string;
  cropId: string; 
}
export interface Recommendation {
  cropId: string;
  diseaseId: string;
  productIds: string[];
}