
import React, { useState, useEffect, useCallback } from 'react';
import LogicPuzzleFrame from './LogicPuzzleFrame';
import LPHints from '../models/LPHints';
import LPCells from '../models/LPCells';
import algoPatterns from '../algorithm/patterns';

const LogicPuzzleAnalyzer = () => {
    const [verticalCount, setVerticalCount] = useState(5);
    const [horizontalCount, setHorizontalCount] = useState(5);
    const [canvasWidth] = useState(500);
    const [canvasHeight] = useState(500);
    const [lPHints, setLPHints] = useState(null);
    const [lPCells, setLPCells] = useState(null);
    const [cellIsShow] = useState(true);
    const [hintsJson, setHintsJson] = useState("");

    // Initial setup
    useEffect(() => {
        const newCells = LPCells.empty(verticalCount, horizontalCount);
        setLPCells(newCells);
        setLPHints(LPHints.createByLPCells(newCells));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only on mount, or when we explicitly reset? 
    // Vue version watched counts and reset. But here counts are updated by JSON usually?
    // Let's replicate Vue watch behavior manually if needed.

    // Watch counts
    useEffect(() => {
        // If this is triggered by hintsJson parsing, we might be double-initializing?
        // In Vue:
        // watch verticalCount -> reset
        // watch hintsJson -> update counts -> which triggers reset?
        // Actually in Vue `hintsJson` watcher updates counts, then `nextTick` sets hints.
        // This implies reset happens first then hints applied?

        // Simplification:
        const newCells = LPCells.empty(verticalCount, horizontalCount);
        setLPCells(newCells);
        setLPHints(LPHints.createByLPCells(newCells));
    }, [verticalCount, horizontalCount]);

    // Watch hintsJson
    useEffect(() => {
        if (!hintsJson) return;
        try {
            const parsedHints = LPHints.createByJson(hintsJson);
            // This will trigger the above effect due to state change
            // We need to handle the ordering.
            // If we change counts, the above effect runs and RESETS lPHints.
            // We need lPHints to be set AFTER reset.

            // Let's do it in one go or use a specific handler.
            // React batching might handle it, but allow effect dependency is tricky.

            // Instead of relying on effect for JSON, let's just do it here.
            // But we need to avoid the count-change effect overriding it.

            // Actually, let's decouple "reset on count change" from "load from JSON".
            // But `hintsJson` input changes frequently? No, user pastes it.

            const hCount = parsedHints.vertical.length;
            const vCount = parsedHints.horizontal.length;

            // We set counts, which triggers reset.
            // Then we modify lPHints?

            // Strategy: Wait for next render?
            // Or better: pass parsedHints to the reset logic?

            // Let's skip the complexity and just force update everything here, 
            // and add a check in the count-effect to not reset if we just loaded hints?
            // Difficult.

            // Alternative: The `verticalCount` effect runs. 
            // Let's just update `verticalCount` and let the effect run, THEN update hints?
            // But we can't easily wait.

            // Solution: Remove the generic "reset on count change" effect and explicit handlers?
            // But Generator uses it. 
            // Let's keep it simple.

            setVerticalCount(vCount);
            setHorizontalCount(hCount);

            // setTimeout to ensure it runs after the reset effect?
            setTimeout(() => {
                setLPHints(parsedHints);
            }, 0);

        } catch (e) {
            console.error(e);
        }
    }, [hintsJson]);

    const onClickAnalyze = async () => {
        await analyze();
    };

    const onClickClear = () => {
        const newCells = LPCells.empty(verticalCount, horizontalCount);
        setLPCells(newCells);
    };

    const onClickCell = useCallback((cellId) => {
        setLPCells(prev => prev.updateNextState(cellId));
    }, []);

    const analyze = async () => {
        if (!lPCells || !lPHints) return;

        let currentLPCells = lPCells.clone();

        // Using a loop with async break for UI updates if allowed? 
        // Vue version is synchronous blocking loop mostly, unless `onAnalyzing` allows render?
        // Vue `onAnalyzing` just updates data. If the loop is sync, UI won't update until done.
        // React state updates won't reflect in the middle of a sync loop.
        // We should probably convert to helper function or use refs, 
        // but sticking to exact port:

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const beforeLPCells = currentLPCells.clone();
            for (let i = 0; i < currentLPCells.vertical.length; i++) {
                algoPatterns.forEach(algo =>
                    algo("vertical", i, lPHints, currentLPCells)
                );
                if (currentLPCells.isVerticalLineFixed(i)) {
                    setLPCells(currentLPCells); // This won't trigger re-render immediately in loop
                    // continue;
                }
            }
            for (let i = 0; i < currentLPCells.horizontal.length; i++) {
                algoPatterns.forEach(algo =>
                    algo("horizontal", i, lPHints, currentLPCells)
                );
                if (currentLPCells.isHorizontalLineFixed(i)) {
                    setLPCells(currentLPCells);
                    // continue;
                }
            }

            if (beforeLPCells.json === currentLPCells.json) {
                break;
            }

            // To allow UI update, we'd need to yield execution.
            // await new Promise(r => setTimeout(r, 0));
        }
        setLPCells(currentLPCells);
        onAnalyzeFinish(currentLPCells);
    };

    const onAnalyzeFinish = (finalCells) => {
        alert(
            `total: ${finalCells.totalCount}, fixed: ${finalCells.fixedCount}, rest: ${finalCells.restCount}`
        );
        console.log(finalCells.score);
    };

    return (
        <div>
            <dl>
                <dt>Import hints JSON:</dt>
                <dd>
                    <textarea
                        value={hintsJson}
                        onChange={(e) => setHintsJson(e.target.value)}
                        rows="5"
                        cols="50"
                    />
                </dd>
            </dl>
            <p>
                <button onClick={onClickAnalyze}>解析</button>
            </p>
            <p>
                <button onClick={onClickClear}>クリア</button>
            </p>
            <LogicPuzzleFrame
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                verticalCount={verticalCount}
                horizontalCount={horizontalCount}
                lPHints={lPHints}
                lPCells={lPCells}
                cellIsShow={cellIsShow}
                onClickCell={onClickCell}
            />
        </div>
    );
};

export default LogicPuzzleAnalyzer;
