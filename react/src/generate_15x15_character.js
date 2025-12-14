
import LPHints from './models/LPHints.js';
import LPCells from './models/LPCells.js';

// Define 15x15
const size = 15;
const grid = Array(size).fill(0).map(() => Array(size).fill(0));

// Draw Ghost (Pacman style)
// Body Fill
for (let y = 3; y <= 11; y++) {
    for (let x = 3; x <= 11; x++) {
        grid[y][x] = 1;
    }
}

// Rounded Top
grid[3][3] = 0; grid[3][11] = 0;

// Eyes (White)
grid[5][5] = 0; grid[5][6] = 0;
grid[6][5] = 0; grid[6][6] = 0;

grid[5][8] = 0; grid[5][9] = 0;
grid[6][8] = 0; grid[6][9] = 0;

// Legs
// y=12
grid[12][3] = 1; grid[12][11] = 1;
grid[12][4] = 1; grid[12][10] = 1;
grid[12][6] = 1; grid[12][8] = 1;
// grid[12][5] and grid[12][7] and grid[12][9] are gaps? 
// Let's make strict legs:
// 3,4 leg. 5 gap. 6,7,8 leg? No too wide.
// 3,4 (leg), 5 (gap), 6,7,8 (center leg), 9 (gap), 10,11 (leg)
grid[12][5] = 0;
grid[12][9] = 0;
grid[12][6] = 1; grid[12][7] = 1; grid[12][8] = 1;


// Create LPCells from grid
const cells = {};
for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
        const cellId = `${x}_${y}`;
        cells[cellId] = { id: cellId, s: grid[y][x] === 1 ? 1 : 2, c: "#000000" };
    }
}
const solvedCells = new LPCells(cells);
const hints = LPHints.createByLPCells(solvedCells);

console.log("Generated Hints JSON:");
console.log(hints.json);
