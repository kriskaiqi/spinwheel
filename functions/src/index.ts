import { setGlobalOptions } from 'firebase-functions/v2';
import { generateWheelEntries } from './generateWheelEntries';

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
setGlobalOptions({ maxInstances: 10 });

// Export the generateWheelEntries function
export { generateWheelEntries };
