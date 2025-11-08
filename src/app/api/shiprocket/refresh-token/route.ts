import { NextResponse } from "next/server";
import ShiprocketTokenManager from "@/lib/shiprocketAuth";

// Manual token refresh endpoint (useful for testing or manual triggers)
export async function POST() {
    try {
        console.log("Manual Shiprocket token refresh requested");
        
        const tokenManager = ShiprocketTokenManager.getInstance();
        await tokenManager.forceRefreshToken();
        
        return NextResponse.json({ 
            success: true, 
            message: "Token refreshed successfully",
            tokenInfo: tokenManager.getTokenInfo()
        });
    } catch (error) {
        console.error("Error refreshing Shiprocket token:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to refresh token",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

// Get token status endpoint
export async function GET() {
    try {
        const tokenManager = ShiprocketTokenManager.getInstance();
        const tokenInfo = tokenManager.getTokenInfo();
        
        return NextResponse.json({
            success: true,
            tokenInfo: tokenInfo || { message: "No token cached" }
        });
    } catch (error) {
        console.error("Error getting token info:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to get token info" 
            },
            { status: 500 }
        );
    }
}