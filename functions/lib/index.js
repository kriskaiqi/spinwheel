"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWheelEntries = void 0;
const v2_1 = require("firebase-functions/v2");
const generateWheelEntries_1 = require("./generateWheelEntries");
Object.defineProperty(exports, "generateWheelEntries", { enumerable: true, get: function () { return generateWheelEntries_1.generateWheelEntries; } });
// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
(0, v2_1.setGlobalOptions)({ maxInstances: 10 });
//# sourceMappingURL=index.js.map