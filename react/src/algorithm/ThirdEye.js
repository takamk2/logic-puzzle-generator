
import BaseAlgorithm from "./BaseAlgorithm.js";
import Mugen from "./Mugen.js";

export default class extends BaseAlgorithm {
    // Params not really used since we defer to LineLogic or set manually
    // But we need params for consistency.

    execute() {
        // Only run Hypothesis on first pass or limit frequency?
        // Computationally expensive. 
        // For now, run if other algorithms didn't make progress?
        // Or just run it.

        // Strategy: Find an indeterminate cell. 
        // Try Paint. Check consistency. If fail -> NoPaint.
        // Try NoPaint. Check consistency. If fail -> Paint.

        const line = this.line; // [0, 1, 2...]

        // Limit to one hypothesis per line execution to save time?
        // Or iterate all unknowns in this line.
        for (let i = 0; i < line.length; i++) {
            if (line[i] !== 0) continue;

            const cellId = this.generateCellId(this.index, i);

            // Try Assuming Paint (1)
            if (!this.checkConsistency(cellId, 1)) {
                // Contradiction! Must be NoPaint (2)
                this.lPCells.updateCell(cellId, { s: 2, c: "#ffcccc" });
                return; // Optimize: Return to main loop to propagate changes with cheaper algorithms
            }

            // Try Assuming NoPaint (2)
            if (!this.checkConsistency(cellId, 2)) {
                // Contradiction! Must be Paint (1)
                this.lPCells.updateCell(cellId, { s: 1, c: "#00b3b3" });
                return; // Optimize
            }
        }
    }

    checkConsistency(assumeCellId, assumeState) {
        // 1. Clone Cells
        const nextCells = this.lPCells.clone();

        // 2. Apply Assumption
        // We don't have updateCell on clone easy access?
        // LPCells has updateCell.
        // But updateCell modifies IN PLACE.
        // clone() returns new LPCells.
        nextCells.updateCell(assumeCellId, { s: assumeState });

        // 3. Propagate (Run LineLogic repeatedly)
        // How many loops? Until stable or contradiction.
        let loop = 0;
        while (true) {
            loop++;
            if (loop > 5) break; // Optimization: Limit recursion depth to 5 (was 20)

            let changed = false;
            const beforeJson = nextCells.json;

            // Check Vertical
            for (let v = 0; v < nextCells.verticalCount; v++) {
                if (nextCells.isVerticalLineFixed(v)) continue;
                const logic = new Mugen("vertical", v, this.lPHints, nextCells);
                const valid = logic.execute(); // Returns false if contradiction
                if (valid === false) return false; // Contradiction found!
            }

            // Check Horizontal
            for (let h = 0; h < nextCells.horizontalCount; h++) {
                if (nextCells.isHorizontalLineFixed(h)) continue;
                const logic = new Mugen("horizontal", h, this.lPHints, nextCells);
                const valid = logic.execute();
                if (valid === false) return false; // Contradiction found!
            }

            if (beforeJson !== nextCells.json) {
                changed = true;
            }

            if (!changed) break;
        }

        return true; // No contradiction found
    }
}
