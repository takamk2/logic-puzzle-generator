import BaseAlgorithm from "./BaseAlgorithm.js";

export default class extends BaseAlgorithm {
    cellParamsFill = { s: 1, c: "#00b3b3" }; // Cyan-ish for fill
    cellParamsEmpty = { s: 2, c: "#ffcccc" }; // Red-ish for empty

    execute() {
        const hints = Object.values(this.hintLine);
        const line = this.line; // Array of current states: 0, 1, 2
        const len = this.subCells.length;

        // Determine all valid patterns
        const validPatterns = [];

        // Recursive function to find patterns
        // hintIdx: current hint index to place
        // pos: current position in the line
        // currentLine: array representing the line being built (0: empty, 1: fill)
        const search = (hintIdx, pos, currentLine) => {
            // Base case: All hints placed
            if (hintIdx === hints.length) {
                // Check if remaining cells can be empty
                for (let i = pos; i < len; i++) {
                    // If existing board has Fill (1) here, this pattern is invalid because we are leaving it Empty
                    // Wait, 'currentLine' is what we are building.
                    // We need to check against 'line' (current board state) at the END or incrementally?
                    // Let's check incrementally for efficiency, but here for remaining:
                    if (line[i] === 1) return;
                    currentLine[i] = 2; // Treat as empty
                }
                validPatterns.push([...currentLine]);
                return;
            }

            const hintLen = hints[hintIdx];
            // Max possible start position
            // Left space needed for remaining hints + gaps
            // Remaining hints: hints.slice(hintIdx+1)
            // Gaps: (remaining count)
            let remainingLen = 0;
            for (let i = hintIdx + 1; i < hints.length; i++) remainingLen += hints[i] + 1;

            const maxStart = len - remainingLen - hintLen;

            for (let start = pos; start <= maxStart; start++) {
                // Check if we can place hint at 'start'

                // 1. Check Pre-gap (between pos and start) must be empty
                // In this loop, we assume 'pos' is the earliest allowed start (after previous hint + gap).
                // Actually, the space from 'pos' to 'start' is gap/empty.
                // Check if existing board allows empty in [pos, start)
                let gapValid = true;
                for (let i = pos; i < start; i++) {
                    if (line[i] === 1) { gapValid = false; break; }
                }
                if (!gapValid) continue; // Cannot leave 1s in the gap

                // 2. Check Hint placement [start, start + hintLen)
                // Must allow Fill. So line[i] cannot be 2.
                let placementValid = true;
                for (let i = start; i < start + hintLen; i++) {
                    if (line[i] === 2) { placementValid = false; break; }
                }
                if (!placementValid) continue;

                // 3. Check Post-gap (start + hintLen)
                // If not last hint, need 1 space.
                // If last hint, handled by next recursion step or base case?
                // Let's handled strictly next char.
                if (hintIdx < hints.length - 1) {
                    // Must be empty at start + hintLen
                    if (line[start + hintLen] === 1) continue;
                }

                // Action: Build currentLine
                // Fill gaps 2
                for (let i = pos; i < start; i++) currentLine[i] = 2;
                // Fill hint 1
                for (let i = start; i < start + hintLen; i++) currentLine[i] = 1;
                // Fill post-gap 2 (if exists)
                let nextPos = start + hintLen;
                if (hintIdx < hints.length - 1) {
                    currentLine[nextPos] = 2;
                    nextPos++;
                }

                // Recurse
                search(hintIdx + 1, nextPos, currentLine);

                // Backtrack (not strictly needed since we copy currentLine or overwrite, 
                // but since we passed reference, we must be careful. 
                // Actually, simpler to just pass a copy or let the loop overwrite
                // But since we are modifying `currentLine` in place, we need to revert? 
                // Creating new array each time is cleaner but slower.
                // Given complexity, let's just create new array for recursion or manage state.)

                // Optimized approach:
                // We don't need to pass full array. Just match `pattern[i]` logic.
                // Reverting:
                // Since we overwrite in the next iteration or return, we might be ok IF we don't read from it?
                // But `validPatterns.push([...currentLine])` reads it.
                // So we need clear state.

                // Let's pass a COPY to be safe for now.
                // Or revert changes.
            }
        };

        // Initial call
        // Note: line is `[0, 1, 2...]`.
        // Valid pattern also uses 1=Fill, 2=Empty. (0 is not used in valid pattern, everything must be determined)
        search(0, 0, new Array(len).fill(0));

        if (validPatterns.length === 0) return false; // Contradiction found or no solution

        // Analyze commonalities
        for (let i = 0; i < len; i++) {
            // If currently unknown
            if (line[i] === 0) {
                const firstVal = validPatterns[0][i];
                let allSame = true;
                for (let k = 1; k < validPatterns.length; k++) {
                    if (validPatterns[k][i] !== firstVal) {
                        allSame = false;
                        break;
                    }
                }

                if (allSame) {
                    if (firstVal === 1) {
                        this.lPCells.updateCell(this.generateCellId(this.index, i), this.cellParamsFill);
                    } else if (firstVal === 2) {
                        this.lPCells.updateCell(this.generateCellId(this.index, i), this.cellParamsEmpty);
                    }
                }
            }
        }
        return true;
    }
}
