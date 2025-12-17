
import LPHints from './models/LPHints.js';
import LPCells from './models/LPCells.js';

const size = 20;
// 20x20 Easy Chiikawa (Silhouette Style)
// X: Fill (Black)
// .: Empty (White)
// To make it easy, we use large filled blocks (Silhouette).
// Facial features are "holes" in the fill.
const ascii = [
    "....................",
    ".....XXX....XXX.....",
    "....XXXXXXXXXXXX....",
    "...XXXXXXXXXXXXXX...",
    "...XXXXXXXXXXXXXX...",
    "..XXXXXXXXXXXXXXXX..",
    "..XXXX..XXXX..XXXX..", // Eyes (holes)
    "..XXXXXXXXXXXXXXXX..",
    "..XXXX..XXXX..XXXX..", // Cheeks (holes)
    "..XXXXXX..XXXXXXXX..", // Mouth (hole)
    "..XXXXXXXXXXXXXXXX..",
    "..XXXXXXXXXXXXXXXX..",
    "..XXXXXXXXXXXXXXXX..",
    "...XXXXXXXXXXXXXX...",
    "...XXXXXXXXXXXXXX...",
    "....XXXXXXXXXXXX....",
    ".....XXXXXXXXXX.....",
    ".....XXXXXXXXXX.....",
    "......XXXX.XXXX.....",
    "...................."
];

const cells = {};
for (let y = 0; y < size; y++) {
    const row = ascii[y] || "....................";
    for (let x = 0; x < size; x++) {
        const char = row[x] || ".";
        const cellId = `${x}_${y}`;
        let s = 2; // Default empty
        let c = "#000000";

        if (char === 'X') {
            s = 1; // Fill
            c = "#000000";
        }

        cells[cellId] = { id: cellId, s: s, c: c };
    }
}

const solvedCells = new LPCells(cells);
const hints = LPHints.createByLPCells(solvedCells);

console.log(hints.json);
