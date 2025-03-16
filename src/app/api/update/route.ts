import { NextResponse } from "next/server";
import { db } from "../../../../utils/firebase";
import { collection, getDocs ,updateDoc,doc} from "firebase/firestore";



// export async function GET() {
//     try {
//       const productsRef = collection(db, "products");
//       const querySnapshot = await getDocs(productsRef);
  
//       let updatedCount = 0;
  
//       // Process each product
//       const updatePromises = querySnapshot.docs.map(async (docSnap) => {
//         const productData = docSnap.data();
        
//         if (productData.name) {
//           const searchValue = productData.name.toLowerCase().replace(/\s+/g, ""); // Convert to lowercase & remove spaces
  
//           // Check if the search field is missing or incorrect
//           if (!productData.search || productData.search !== searchValue) {
//             await updateDoc(doc(db, "products", docSnap.id), { search: searchValue });
//             updatedCount++;
//           }
//         }
//       });
  
//       await Promise.all(updatePromises); // Ensure all updates complete
  
//       return NextResponse.json({ 
//         success: true, 
//         message: `Updated ${updatedCount} products with the 'search' field.` 
//       }, { status: 200 });
  
//     } catch (error) {
//       console.error("Error updating products:", error);
//       return NextResponse.json({ success: false, error: "Error updating products" }, { status: 500 });
//     }
// }
function generateKeywords(name: string): string[] {
  const keywords: Set<string> = new Set();
  const processedName = name.toLowerCase().replace(/\s+/g, ""); // Normalize input

  for (let i = 0; i < processedName.length; i++) {
    for (let j = i + 1; j <= processedName.length; j++) {
      keywords.add(processedName.substring(i, j));
    }
  }

  return Array.from(keywords);
}

// API Handler
export async function GET( ) {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    if (querySnapshot.empty) {
      return NextResponse.json({ success: false, message: "No products found" }, { status: 404 });
    }

    const updatePromises = querySnapshot.docs.map(async (docSnap) => {
      const productData = docSnap.data();
      if (productData.name) {
        const keywords = generateKeywords(productData.name);

        // Update Firestore with the new keywords field
        await updateDoc(doc(db, "products", docSnap.id), { keywords });
        console.log(`✅ Updated product: ${productData.name}`);
      }
    });

    await Promise.all(updatePromises);
    return NextResponse.json({ success: true, message: "All products updated with keywords!" }, { status: 200 });

  } catch (error) {
    console.error("❌ Error updating products:", error);
    return NextResponse.json({ success: false, error: "Error updating products" }, { status: 500 });
  }
}