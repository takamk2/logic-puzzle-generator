
import LPHints from './models/LPHints.js';
import LPCells from './models/LPCells.js';
import patterns from './algorithm/patterns.js';

// Define a 20x20 pattern (Space Invader style or similar)
const size = 20;
const grid = Array(size).fill(0).map(() => Array(size).fill(0));

// Draw a shifted Invader-like pattern
const drawPixel = (x, y) => {
    if (x >= 0 && x < size && y >= 0 && y < size) {
        grid[y][x] = 1;
    }
};

// Simple symmetric pattern
for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
        // Border
        if (x === 0 || x === size - 1 || y === 0 || y === size - 1) {
            drawPixel(x, y);
        }
        // Cross
        if (x === y || x === size - 1 - y) {
            drawPixel(x, y);
        }
        // Inner box
        if (x >= 5 && x <= 14 && y >= 5 && y <= 14) {
            if (x === 5 || x === 14 || y === 5 || y === 14) drawPixel(x, y);
            // Heart shape roughly inside
            if (x >= 7 && x <= 12 && y >= 7 && y <= 12) {
                // skip
            } else if (x >= 6 && x <= 13 && y >= 6 && y <= 13) {
                drawPixel(x, y);
            }
        }
    }
}

// Create LPCells from grid
const cells = {};
for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
        const cellId = `${x}_${y}`; // Note: LPCells uses col_row? Let's check constructor.
        // LPCells.empty uses:
        // for (let i = 0; i < horizontalCount; i++) { for (let j = 0; j < verticalCount; j++) { cellId = `${i}_${j}` ... } }
        // i is horizontal index (x), j is vertical index (y). 
        // So `${x}_${y}` is correct.
        cells[cellId] = { id: cellId, s: grid[y][x] === 1 ? 1 : 2, c: "#000000" }; // 2 is NoPaint (Background)
    }
}
const solvedCells = new LPCells(cells);
const hints = LPHints.createByLPCells(solvedCells);

console.log("Generated Hints JSON:");
console.log(hints.json);

// Verify Solvability
console.log("\nVerifying Solvability...");
const testCells = LPCells.empty(size, size);
let loopCount = 0;
while (true) {
    loopCount++;
    const beforeJson = testCells.json;

    // Vertical Pass
    for (let i = 0; i < testCells.verticalCount; i++) {
        patterns.forEach(algo => algo("vertical", i, hints, testCells));
    }

    // Horizontal Pass
    for (let i = 0; i < testCells.horizontalCount; i++) {
        patterns.forEach(algo => algo("horizontal", i, hints, testCells));
    }

    if (beforeJson === testCells.json) break;
    if (loopCount > 20) break;
}

if (testCells.restCount === 0) {
    console.log("✅ Solvable!");
} else {
    console.log(`⚠️ Unsolvable (Rest: ${testCells.restCount})`);
}
