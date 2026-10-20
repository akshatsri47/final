import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../utils/firebase";

export async function GET() {
  try {
    const snapshot = await getDoc(doc(db, "siteSettings", "homeVideo"));
    const videoUrl = snapshot.exists() ? snapshot.data().videoUrl : "";
    return NextResponse.json({ videoUrl: typeof videoUrl === "string" ? videoUrl : "" });
  } catch (error) {
    console.error("Error fetching home video:", error);
    return NextResponse.json({ videoUrl: "" }, { status: 500 });
  }
}
