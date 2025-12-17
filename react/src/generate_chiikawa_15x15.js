
import LPHints from './models/LPHints.js';
import LPCells from './models/LPCells.js';

const size = 15;
// 15x15 Chiikawa (Simplified)
// 0: Empty, 1: Outline/Black, 2: Pink (Cheeks)
const ascii = [
    "...............",
    "..XX.......XX..", // Ears
    ".X..XXXXXXX..X.",
    ".X...........X.",
    "X.............X",
    "X...O.....O...X", // Eyes
    "X.............X",
    "X...=.....=...X", // Cheeks
    "X......v......X", // Mouth
    "X.............X",
    "X.............X",
    ".X...........X.",
    ".X...XX.XX...X.", // Feet
    "..XXX.....XXX..",
    "..............."
];

const cells = {};
for (let y = 0; y < size; y++) {
    const row = ascii[y] || "...............";
    for (let x = 0; x < size; x++) {
        const char = row[x] || ".";
        const cellId = `${x}_${y}`;
        let s = 2; // Default empty
        let c = "#000000";

        if (char === 'X' || char === 'O' || char === 'v') {
            s = 1;
            c = "#000000";
        } else if (char === '=') {
            s = 1;
            c = "#FFB6C1"; // Cheeks
        }

        cells[cellId] = { id: cellId, s: s, c: c };
    }
}

const solvedCells = new LPCells(cells);
const hints = LPHints.createByLPCells(solvedCells);

console.log(hints.json);
