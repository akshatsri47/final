import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../utils/firebase";
import { collection,query,where , getDocs} from "firebase/firestore";

export async function GET(req: NextRequest) {
  try {
      const { searchParams } = new URL(req.url);
      const queryText = searchParams.get("q")?.toLowerCase().replace(/\s+/g, "");

      if (!queryText) {
          return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
      }

      const productsRef = collection(db, "products");

      // ✅ **Use `array-contains` for substring search**
      const q = query(productsRef, where("keywords", "array-contains", queryText));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
          return NextResponse.json({ success: false, data: [], message: "No products found" }, { status: 404 });
      }

      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return NextResponse.json({ success: true, data: products }, { status: 200 });

  } catch (error) {
      console.error("Error fetching search results:", error);
      return NextResponse.json({ success: false, error: "Error fetching search results" }, { status: 500 });
  }
}
//   async function updateExistingProducts() {
//     try {
//       const productsRef = collection(db, "products");
//       const querySnapshot = await getDocs(productsRef);
  
//       querySnapshot.forEach(async (docSnap) => {
//         const productData = docSnap.data();
  
//         if (productData.name) {
//           const searchValue = productData.name.toLowerCase().replace(/\s+/g, ""); // Convert to lowercase and remove spaces
//           await updateDoc(doc(db, "products", docSnap.id), {
//             search: searchValue,
//           });
//         }
//       });
  
//       console.log("✅ All existing products updated with the `search` field!");
//     } catch (error) {
//       console.error("Error updating products:", error);
//     }
//   }
//   updateExistingProducts();
  