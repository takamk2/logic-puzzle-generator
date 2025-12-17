
import LPHints from './models/LPHints.js';
import LPCells from './models/LPCells.js';

const size = 20;
// 0: Empty, 1: Outline/Black, 2: Pink (Cheeks)
// "Chiikawa" is white, so we draw the outline.
const ascii = [
    "....................",
    "....................",
    ".....XXX....XXX.....",
    "....X...XXXX...X....",
    "...X............X...",
    "...X............X...",
    "..X..............X..",
    "..X..OO......OO..X..", // Eyes
    "..X..............X..",
    "..X..==......==..X..", // Cheeks (Pink?)
    "..X......vv......X..", // Mouth
    "..X..............X..",
    "..X..............X..",
    "..X..............X..",
    "...X............X...",
    "...X............X...",
    "....X..........X....",
    ".....X...XX...X.....", // Feet/Bottom
    "......XXXX.XXXX.....",
    "...................."
];

const cells = {};
for (let y = 0; y < size; y++) {
    const row = ascii[y] || "....................";
    for (let x = 0; x < size; x++) {
        const char = row[x] || ".";
        const cellId = `${x}_${y}`;
        let s = 2; // Default empty/nopaint
        let c = "#000000";

        if (char === 'X' || char === 'O' || char === 'v') {
            s = 1;
            c = "#000000"; // Outline - Black
        } else if (char === '=') {
            s = 1;
            c = "#FFB6C1"; // Cheeks - Light Pink
        }

        cells[cellId] = { id: cellId, s: s, c: c };
    }
}

const solvedCells = new LPCells(cells);
const hints = LPHints.createByLPCells(solvedCells);

console.log(hints.json);
