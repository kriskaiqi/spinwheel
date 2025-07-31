import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { generateEntries } from './aiService';

interface GenerateWheelEntriesData {
  theme: string;
  count: number;
}

interface GenerateWheelEntriesResult {
  entries: string[];
}

/**
 * HTTP onCall function to generate wheel entries using AI
 * Validates authentication and input parameters
 */
export const generateWheelEntries = onCall(
  async (request): Promise<GenerateWheelEntriesResult> => {
    // Validate authentication
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated to generate wheel entries');
    }

    const { theme, count } = request.data as GenerateWheelEntriesData;

    // Validate theme parameter
    if (!theme || typeof theme !== 'string') {
      throw new HttpsError('invalid-argument', 'Theme must be a non-empty string');
    }

    if (theme.length > 100) {
      throw new HttpsError('invalid-argument', 'Theme must be 100 characters or less');
    }

    // Validate count parameter
    if (!count || typeof count !== 'number') {
      throw new HttpsError('invalid-argument', 'Count must be a number');
    }

    if (!Number.isInteger(count) || count < 1 || count > 20) {
      throw new HttpsError('invalid-argument', 'Count must be an integer between 1 and 20');
    }

    try {
      // Generate entries using AI service
      const entries = await generateEntries(theme, count);
      
      return {
        entries
      };
    } catch (error) {
      console.error('Error generating wheel entries:', error);
      throw new HttpsError(
        'internal', 
        `Failed to generate wheel entries: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
);
