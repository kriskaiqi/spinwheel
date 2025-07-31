"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWheelEntries = void 0;
const https_1 = require("firebase-functions/v2/https");
const aiService_1 = require("./aiService");
/**
 * HTTP onCall function to generate wheel entries using AI
 * Validates authentication and input parameters
 */
exports.generateWheelEntries = (0, https_1.onCall)(async (request) => {
    // Validate authentication
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'User must be authenticated to generate wheel entries');
    }
    const { theme, count } = request.data;
    // Validate theme parameter
    if (!theme || typeof theme !== 'string') {
        throw new https_1.HttpsError('invalid-argument', 'Theme must be a non-empty string');
    }
    if (theme.length > 100) {
        throw new https_1.HttpsError('invalid-argument', 'Theme must be 100 characters or less');
    }
    // Validate count parameter
    if (!count || typeof count !== 'number') {
        throw new https_1.HttpsError('invalid-argument', 'Count must be a number');
    }
    if (!Number.isInteger(count) || count < 1 || count > 20) {
        throw new https_1.HttpsError('invalid-argument', 'Count must be an integer between 1 and 20');
    }
    try {
        // Generate entries using AI service
        const entries = await (0, aiService_1.generateEntries)(theme, count);
        return {
            entries
        };
    }
    catch (error) {
        console.error('Error generating wheel entries:', error);
        throw new https_1.HttpsError('internal', `Failed to generate wheel entries: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});
//# sourceMappingURL=generateWheelEntries.js.map