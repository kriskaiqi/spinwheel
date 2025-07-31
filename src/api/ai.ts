import { httpsCallable, getFunctions } from 'firebase/functions';
import { initializeApp } from 'firebase/app';

// Initialize Firebase app directly to avoid import issues
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, 
};

const app = initializeApp(firebaseConfig);

interface GenerateWheelEntriesData {
  theme: string;
  count: number;
}

interface GenerateWheelEntriesResult {
  entries: string[];
}

// Firebase Functions error interface
interface FirebaseFunctionsError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Request wheel entries from AI service
 * @param theme - The theme for generating wheel entries
 * @param count - Optional number of entries to generate (defaults to 8)
 * @returns Promise<string[]> - Array of generated wheel entries
 */
export async function requestWheelEntries(theme: string, count?: number): Promise<string[]> {
  try {
    // Set default count to 8 if not provided
    const entryCount = count ?? 8;
    
    // Get functions instance
    const functions = getFunctions(app);
    
    // Get the callable function
    const generateWheelEntries = httpsCallable<GenerateWheelEntriesData, GenerateWheelEntriesResult>(
      functions,
      'generateWheelEntries'
    );
    
    // Call the function
    const result = await generateWheelEntries({
      theme,
      count: entryCount
    });
    
    return result.data.entries;
  } catch (error: unknown) {
    // Handle Firebase Functions errors specifically
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
      const firebaseError = error as FirebaseFunctionsError;
      
      switch (firebaseError.code) {
        case 'unauthenticated':
          throw new Error('You must be signed in to generate wheel entries. Please log in and try again.');
        case 'invalid-argument':
          throw new Error(`Invalid input: ${firebaseError.message}`);
        case 'permission-denied':
          throw new Error('You do not have permission to generate wheel entries.');
        case 'resource-exhausted':
          throw new Error('Service is temporarily overloaded. Please try again in a few moments.');
        case 'internal':
          throw new Error('An internal error occurred while generating entries. Please try again.');
        case 'unavailable':
          throw new Error('The service is currently unavailable. Please check your internet connection and try again.');
        default:
          throw new Error(`Failed to generate wheel entries: ${firebaseError.message}`);
      }
    }
    
    // Handle other types of errors
    if (error instanceof Error) {
      throw new Error(`Network error: ${error.message}`);
    }
    
    // Fallback for unknown errors
    throw new Error('An unexpected error occurred while generating wheel entries. Please try again.');
  }
}
