import { NextResponse } from "next/server";
import ShiprocketTokenManager from "@/lib/shiprocketAuth";

// Health check endpoint for Shiprocket token status
export async function GET() {
    try {
        const tokenManager = ShiprocketTokenManager.getInstance();
        
        // Try to get a valid token (this will refresh if needed)
        const token = await tokenManager.getValidToken();
        const tokenInfo = tokenManager.getTokenInfo();
        
        return NextResponse.json({
            success: true,
            status: "Token is valid and ready",
            tokenInfo,
            hasToken: !!token
        });
    } catch (error) {
        console.error("Shiprocket token status check failed:", error);
        return NextResponse.json(
            { 
                success: false, 
                status: "Token validation failed",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}