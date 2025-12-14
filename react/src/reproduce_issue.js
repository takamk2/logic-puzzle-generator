
import LPHints from './models/LPHints.js';
import LPCells from './models/LPCells.js';
import patterns from './algorithm/patterns.js';

// User provided JSON
const hintsJson = JSON.stringify({ "v": [[2], [2, 1], [1], [1, 2], [2]], "h": [[2], [2, 1], [1], [1, 2], [2]] });

console.log("Analyzing with hints:", hintsJson);

const lPHints = LPHints.createByJson(hintsJson);
const hCount = lPHints.horizontal.length; // 5
const vCount = lPHints.vertical.length;   // 5

let lPCells = LPCells.empty(vCount, hCount);

// Run analysis loop (similar to LogicPuzzleAnalyzer.jsx)
let loopCount = 0;
while (true) {
    loopCount++;
    const beforeJson = lPCells.json;

    // Vertical Pass
    for (let i = 0; i < lPCells.vertical.length; i++) {
        patterns.forEach(algo => algo("vertical", i, lPHints, lPCells));
    }

    // Horizontal Pass
    for (let i = 0; i < lPCells.horizontal.length; i++) {
        patterns.forEach(algo => algo("horizontal", i, lPHints, lPCells));
    }

    if (beforeJson === lPCells.json) {
        break;
    }
    if (loopCount > 20) break; // Safety
}

console.log("Analysis finished in loops:", loopCount);
console.log("Final State:");

// Visual Print
for (let i = 0; i < hCount; i++) {
    const line = lPCells.horizontal[i];
    const lineStr = line.map(s => {
        if (s === 1) return '■';
        if (s === 2) return 'x';
        return '.';
    }).join(' ');
    console.log(`Row ${i} hint [${lPHints.horizontal[i]}]: ${lineStr}`);
}

// Print Column state for clarity
console.log("\nColumns:");
for (let i = 0; i < vCount; i++) {
    const line = lPCells.vertical[i];
    const lineStr = line.map(s => {
        if (s === 1) return '■';
        if (s === 2) return 'x';
        return '.';
    }).join(' ');
    console.log(`Col ${i} hint [${lPHints.vertical[i]}]: ${lineStr}`);
}
