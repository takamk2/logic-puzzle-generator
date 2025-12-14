import BaseAlgorithm from "./BaseAlgorithm.js";

export default class extends BaseAlgorithm {
    cellParams = {
        s: 1,
        c: "#00b3b3" // Cyan-ish for overlap
    };

    execute() {
        const hints = Object.values(this.hintLine);
        const totalHints = hints.reduce((sum, h) => sum + h, 0);
        // Minimum gaps required between hints is hints.length - 1
        const minGaps = Math.max(0, hints.length - 1);
        const minRequired = totalHints + minGaps;
        const slack = this.subCells.length - minRequired;

        // If slack is negative, it's impossible (should cover in other checks), but if too large, no overlap.
        if (slack < 0) return; // Should not happen in valid puzzles

        let currentMinStart = 0;

        hints.forEach(hintLen => {
            // Range of possible start positions for this hint:
            // Earliest: currentMinStart
            // Latest: currentMinStart + slack

            const maxStart = currentMinStart + slack;

            // Overlap range:
            // The block MUST cover indices from `maxStart` to `currentMinStart + hintLen - 1` (inclusive)
            // or [maxStart, currentMinStart + hintLen)

            // Example: Hint 2, Slack 1. Starts at 2.
            // minStart = 2. maxStart = 3.
            // Range [3, 2+2) = [3, 4). Index 3. 

            const overlapStart = maxStart;
            const overlapEnd = currentMinStart + hintLen;

            if (overlapStart < overlapEnd) {
                for (let i = overlapStart; i < overlapEnd; i++) {
                    const cellId = this.generateCellId(this.index, i);
                    if (!this.lPCells.isFixed(cellId)) {
                        this.lPCells.updateCell(cellId, this.cellParams);
                    }
                }
            }

            // Advance minStart for next hint
            currentMinStart += hintLen + 1; // +1 for gap
        });
    }
}
