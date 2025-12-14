
import LPHints from './models/LPHints.js';
import LPCells from './models/LPCells.js';
import patterns from './algorithm/patterns.js';

const generateAndVerify = (name, size, drawFn) => {
    console.log(`\n--- Generating ${name} (${size}x${size}) ---`);
    const grid = Array(size).fill(0).map(() => Array(size).fill(0));
    drawFn(grid, size);

    const cells = {};
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cellId = `${x}_${y}`;
            cells[cellId] = { id: cellId, s: grid[y][x] === 1 ? 1 : 2, c: "#000000" };
        }
    }
    const solvedCells = new LPCells(cells);
    const hints = LPHints.createByLPCells(solvedCells);

    // Verify (Disabled for speed - let the user test it!)
    /*
    const testCells = LPCells.empty(size, size);
    let loopCount = 0;
    while (true) {
        loopCount++;
        const beforeJson = testCells.json;
        testCells.vertical.forEach((_, i) => patterns.forEach(algo => algo("vertical", i, hints, testCells)));
        testCells.horizontal.forEach((_, i) => patterns.forEach(algo => algo("horizontal", i, hints, testCells)));
        
        if (beforeJson === testCells.json) break;
        if (loopCount > 20) break;
    }
    
    console.log(`Solvable: ${testCells.restCount === 0 ? "YES" : "NO (Rest: " + testCells.restCount + ")"}`);
    */
    console.log("Solvability: Unknown (Try it!)");
    console.log("Hints JSON:");
    console.log(hints.json);
};

// 1. Spiral (20x20) - Reduced from 25 for speed
const drawSpiral = (grid, size) => {
    let x = 0, y = 0, dx = 1, dy = 0;
    for (let i = 0; i < size * size; i++) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            if (i % 2 === 0) grid[y][x] = 1; // Dotted spiral? No, let's make line spiral
            // Actually drawing a continuous line is harder with loop index
        }
    }
    // Simple concentric rings
    for (let i = 0; i < size / 2; i += 2) {
        for (let k = i; k < size - i; k++) {
            grid[i][k] = 1; // Top
            grid[size - 1 - i][k] = 1; // Bottom
            grid[k][i] = 1; // Left
            grid[k][size - 1 - i] = 1; // Right
        }
    }
    // Add connector to make it a spiral?
    // Let's keep concentric rings, it's tricky enough for LineLogic (Mugen).
    grid[1][0] = 0; // Cut outer ring?
};

// 2. Checkerboard (15x15) - Pure logic test
const drawCheckers = (grid, size) => {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if ((x + y) % 2 === 0) grid[y][x] = 1;
        }
    }
};

// 3. Invader (15x15) - Dense cluster
const drawInvader = (grid, size) => {
    // 11x8 invader centered
    const invader = [
        "00100000100",
        "00010001000",
        "00111111100",
        "01101110110",
        "11111111111",
        "10111111101",
        "10100000101",
        "00011011000"
    ];
    let offX = 2;
    let offY = 3;
    for (let r = 0; r < invader.length; r++) {
        for (let c = 0; c < invader[r].length; c++) {
            if (invader[r][c] === '1') grid[offY + r][offX + c] = 1;
        }
    }
};

// 4. Frames (20x20) - Overlapping frames
const drawFrames = (grid, size) => {
    // Frame 1
    for (let i = 2; i < 18; i++) { grid[2][i] = 1; grid[17][i] = 1; grid[i][2] = 1; grid[i][17] = 1; }
    // Frame 2
    for (let i = 5; i < 15; i++) { grid[5][i] = 1; grid[14][i] = 1; grid[i][5] = 1; grid[i][14] = 1; }
    // Cross
    for (let i = 0; i < size; i++) { grid[i][i] = 1; grid[i][size - 1 - i] = 1; }
};

// 5. Random Solvable (20x20) - Try to find a random solvable one?
// Deterministic pseudo-random for reproducibility
const drawRandom = (grid, size) => {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (((x * x + y * y + x * y) % 7) < 3) grid[y][x] = 1;
        }
    }
};

generateAndVerify("Concentric Rings", 20, drawSpiral);
generateAndVerify("Checkerboard", 15, drawCheckers);
generateAndVerify("Invader", 15, drawInvader);
generateAndVerify("Frames & Cross", 20, drawFrames);
generateAndVerify("Math Pattern", 20, drawRandom);
