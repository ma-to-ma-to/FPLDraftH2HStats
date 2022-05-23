import * as processMatches from './processMatches.js';
import * as processTransfers from './processTransfers.js';
import * as processPointBreakdowns from './processPointBreakdowns.js';

if (process.argv.length !== 3) {
    console.error('Expected one argument!');
    process.exit(1);
}

if (isNaN(process.argv[2])) {
    console.error('Argument ' + process.argv[2] + ' is not valid - must be league id number!');
    process.exit(1);
}

await processMatches.run(process.argv[2]);
await processTransfers.run(process.argv[2]);
await processPointBreakdowns.run(process.argv[2]);

console.log("All complete!");