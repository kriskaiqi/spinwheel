/**
 * Import function triggers from their respective submodules:
 *
 * This file imports the compiled TypeScript functions from the lib directory
 */

// Import compiled TypeScript functions
const { generateWheelEntries } = require('./lib/index');

// Export functions for deployment
exports.generateWheelEntries = generateWheelEntries;
