
import LPHints from './models/LPHints.js';
import LPCells from './models/LPCells.js';

const size = 25;
const grid = Array(size).fill(0).map(() => Array(size).fill(0));

// Draw a Cat Face (25x25)
// Center roughly at x=12, y=12
// Head circle: radius ~9
const centerX = 12;
const centerY = 13;

for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
        // Main face circle
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        if (dist < 9.5) grid[y][x] = 1;

        // Ears
        // Left Ear
        if (y < 8 && x < 8) {
            // Triangle roughly
            if (y > 2 && x > 2 && y + x < 14 && y - x < 5 && x - y < 5) grid[y][x] = 1;
        }
        // Right Ear
        if (y < 8 && x > 16) {
            // Triangle roughly
            if (y > 2 && x < 22 && x - y > 10) grid[y][x] = 1;
        }
    }
}

// Finer adjustments for Ears (manual override for cleaner pixel art)
// Left Ear
grid[3][3] = 1; grid[3][4] = 1; grid[3][5] = 1;
grid[4][3] = 1; grid[4][4] = 1; grid[4][5] = 1; grid[4][6] = 1;
grid[5][2] = 1; grid[5][3] = 1; grid[5][4] = 1; grid[5][5] = 1; grid[5][6] = 1; grid[5][7] = 1;

// Right Ear
grid[3][19] = 1; grid[3][20] = 1; grid[3][21] = 1;
grid[4][18] = 1; grid[4][19] = 1; grid[4][20] = 1; grid[4][21] = 1;
grid[5][17] = 1; grid[5][18] = 1; grid[5][19] = 1; grid[5][20] = 1; grid[5][21] = 1; grid[5][22] = 1;

// Eyes (White gaps)
// Left Eye
grid[11][8] = 0; grid[11][9] = 0;
grid[12][8] = 0; grid[12][9] = 0;

// Right Eye
grid[11][15] = 0; grid[11][16] = 0;
grid[12][15] = 0; grid[12][16] = 0;

// Nose & Mouth
grid[15][12] = 0; // Nose
grid[17][12] = 0; // Mouth center
grid[17][10] = 0; grid[17][11] = 0; // Mouth left
grid[17][13] = 0; grid[17][14] = 0; // Mouth right
grid[16][10] = 0; grid[16][14] = 0; // Mouth tips

// Whiskers
// Left
grid[14][2] = 0; grid[14][3] = 0; grid[14][4] = 0;
grid[16][2] = 0; grid[16][3] = 0; grid[16][4] = 0;

// Right
grid[14][20] = 0; grid[14][21] = 0; grid[14][22] = 0;
grid[16][20] = 0; grid[16][21] = 0; grid[16][22] = 0;


const cells = {};
for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
        const cellId = `${x}_${y}`;
        cells[cellId] = { id: cellId, s: grid[y][x] === 1 ? 1 : 2, c: "#000000" };
    }
}
const solvedCells = new LPCells(cells);
const hints = LPHints.createByLPCells(solvedCells);

console.log("Hints JSON:");
console.log(hints.json);
