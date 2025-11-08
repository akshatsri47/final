import axios from 'axios';
import { db } from '../../utils/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface TokenCache {
  token: string;
  expiresAt: number;
  lastFetched: number;
}

interface FirestoreTokenData {
  token: string;
  expiresAt: number;
  createdAt: unknown; // Firestore timestamp
  updatedAt: unknown; // Firestore timestamp
}

class ShiprocketTokenManager {
  private static instance: ShiprocketTokenManager;
  private tokenCache: TokenCache | null = null;
  private readonly CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
  private readonly TOKEN_REFRESH_THRESHOLD = 2 * 24 * 60 * 60 * 1000; // 2 days before expiry
  private readonly FIRESTORE_COLLECTION = 'system';
  private readonly FIRESTORE_DOC_ID = 'shiprocket-token';

  private constructor() {
    // No initialization needed for Firestore since we're using the existing Firebase config
  }

  public static getInstance(): ShiprocketTokenManager {
    if (!ShiprocketTokenManager.instance) {
      ShiprocketTokenManager.instance = new ShiprocketTokenManager();
    }
    return ShiprocketTokenManager.instance;
  }

  private parseJWT(token: string): { exp: number } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  private async refreshShiprocketToken(): Promise<string> {
    try {
      console.log('Refreshing Shiprocket token...');
      
      const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      });

      const newToken = response.data.token;
      
      if (!newToken) {
        throw new Error('No token received from Shiprocket login');
      }

      // Store the new token in Firestore
      await this.storeTokenInFirestore(newToken);
      
      console.log('Shiprocket token refreshed and stored successfully');
      return newToken;
    } catch (error) {
      console.error('Error refreshing Shiprocket token:', error);
      throw new Error('Failed to refresh Shiprocket token');
    }
  }

  private async storeTokenInFirestore(token: string): Promise<void> {
    try {
      const payload = this.parseJWT(token);
      const expiresAt = payload?.exp ? payload.exp * 1000 : Date.now() + (14 * 24 * 60 * 60 * 1000);

      const tokenData: FirestoreTokenData = {
        token,
        expiresAt,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const tokenRef = doc(db, this.FIRESTORE_COLLECTION, this.FIRESTORE_DOC_ID);
      await setDoc(tokenRef, tokenData, { merge: true });

      console.log('Token stored in Firestore successfully');
    } catch (error) {
      console.error('Error storing token in Firestore:', error);
      throw error;
    }
  }

  private async getTokenFromFirestore(): Promise<string> {
    try {
      const tokenRef = doc(db, this.FIRESTORE_COLLECTION, this.FIRESTORE_DOC_ID);
      const tokenSnap = await getDoc(tokenRef);

      if (!tokenSnap.exists()) {
        throw new Error('No token found in Firestore');
      }

      const tokenData = tokenSnap.data() as FirestoreTokenData;
      
      if (!tokenData.token) {
        throw new Error('Invalid token data in Firestore');
      }

      return tokenData.token;
    } catch (error) {
      console.error('Error fetching token from Firestore:', error);
      throw error;
    }
  }

  private isTokenExpiringSoon(token: string): boolean {
    const payload = this.parseJWT(token);
    if (!payload || !payload.exp) {
      return true; // If we can't parse, assume it's expiring
    }

    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;

    return timeUntilExpiry <= this.TOKEN_REFRESH_THRESHOLD;
  }

  private isCacheValid(): boolean {
    if (!this.tokenCache) {
      return false;
    }

    const now = Date.now();
    const cacheAge = now - this.tokenCache.lastFetched;
    
    return cacheAge < this.CACHE_DURATION;
  }

  public async getValidToken(): Promise<string> {
    try {
      // Check if we have a valid cached token
      if (this.isCacheValid() && this.tokenCache) {
        const isExpiring = this.isTokenExpiringSoon(this.tokenCache.token);
        
        if (!isExpiring) {
          console.log('Using cached Shiprocket token');
          return this.tokenCache.token;
        }
      }

      console.log('Fetching token from Firestore...');
      
      // Try to get token from Firestore first
      let token: string;
      try {
        token = await this.getTokenFromFirestore();
      } catch (firestoreError) {
        // If Firestore fails, fall back to env variable for initial setup
        console.log('Falling back to environment variable token', firestoreError);
        token = process.env.SHIPROCKET_API_TOKEN!;
        
        if (!token) {
          throw new Error('No Shiprocket token available');
        }
        
        // Store the env token in Firestore for future use
        await this.storeTokenInFirestore(token);
      }

      // Check if the token is expiring soon
      if (this.isTokenExpiringSoon(token)) {
        console.log('Token is expiring soon, refreshing...');
        token = await this.refreshShiprocketToken();
      }

      // Update cache
      const payload = this.parseJWT(token);
      this.tokenCache = {
        token,
        expiresAt: payload?.exp ? payload.exp * 1000 : Date.now() + (14 * 24 * 60 * 60 * 1000),
        lastFetched: Date.now()
      };

      return token;
    } catch (error) {
      console.error('Error getting valid Shiprocket token:', error);
      
      // Last resort: try environment variable
      const fallbackToken = process.env.SHIPROCKET_API_TOKEN;
      if (fallbackToken) {
        console.log('Using fallback environment token');
        return fallbackToken;
      }
      
      throw new Error('Unable to obtain valid Shiprocket token');
    }
  }

  // Method to manually refresh token (useful for testing or manual triggers)
  public async forceRefreshToken(): Promise<string> {
    console.log('Force refreshing Shiprocket token...');
    const newToken = await this.refreshShiprocketToken();
    
    // Update cache
    const payload = this.parseJWT(newToken);
    this.tokenCache = {
      token: newToken,
      expiresAt: payload?.exp ? payload.exp * 1000 : Date.now() + (14 * 24 * 60 * 60 * 1000),
      lastFetched: Date.now()
    };
    
    return newToken;
  }

  // Method to get token info (useful for debugging)
  public getTokenInfo(): { cached: boolean; expiresAt?: Date; cacheAge?: number } | null {
    if (!this.tokenCache) {
      return null;
    }

    return {
      cached: this.isCacheValid(),
      expiresAt: new Date(this.tokenCache.expiresAt),
      cacheAge: Date.now() - this.tokenCache.lastFetched
    };
  }
}

export default ShiprocketTokenManager;