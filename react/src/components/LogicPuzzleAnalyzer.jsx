
import React, { useState, useEffect, useCallback } from 'react';
import LogicPuzzleFrame from './LogicPuzzleFrame';
import LPHints from '../models/LPHints';
import LPCells from '../models/LPCells';
import algoPatterns from '../algorithm/patterns';

const LogicPuzzleAnalyzer = () => {
    const [verticalCount, setVerticalCount] = useState(5);
    const [horizontalCount, setHorizontalCount] = useState(5);
    const [canvasWidth, setCanvasWidth] = useState(500);
    const [canvasHeight, setCanvasHeight] = useState(500);
    const [lPHints, setLPHints] = useState(null);
    const [lPCells, setLPCells] = useState(null);
    const [cellIsShow] = useState(true);
    const [hintsJson, setHintsJson] = useState("");
    const [status, setStatus] = useState("Ready");
    const [isSingleColor, setIsSingleColor] = useState(false);

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
    // Watch counts: REMOVED auto-reset to avoid race condition with JSON import
    // useEffect(() => {
    //     const newCells = LPCells.empty(verticalCount, horizontalCount);
    //     setLPCells(newCells);
    //     setLPHints(LPHints.createByLPCells(newCells));
    // }, [verticalCount, horizontalCount]);

    // Manual reset helper
    const resetBoard = (v, h) => {
        const newCells = LPCells.empty(v, h);
        setLPCells(newCells);
        setLPHints(LPHints.createByLPCells(newCells));
    };

    // Watch hintsJson
    // Watch hintsJson
    useEffect(() => {
        if (!hintsJson) return;
        try {
            const parsedHints = LPHints.createByJson(hintsJson);
            const hCount = parsedHints.vertical.length;
            const vCount = parsedHints.horizontal.length;

            // Set counts
            setVerticalCount(vCount);
            setHorizontalCount(hCount);

            // Set Hints & Reset Cells directly
            setLPHints(parsedHints);
            setLPCells(LPCells.empty(vCount, hCount));

            // Dynamic Canvas Size Calculation
            const HINT_SIZE = 20;
            const MARGIN = 10;
            const TARGET_CELL_SIZE = 24;

            // Note: Left hints correspond to horizontal rows (hCount), but logic usually depends on max hint length
            // LogicPuzzleFrame assumes max hint length is roughly count/2.
            const leftHintWidth = Math.ceil(hCount / 2) * HINT_SIZE;
            const topHintHeight = Math.ceil(vCount / 2) * HINT_SIZE;

            const w = MARGIN * 2 + leftHintWidth + (hCount * TARGET_CELL_SIZE);
            const h = MARGIN * 2 + topHintHeight + (vCount * TARGET_CELL_SIZE);

            setCanvasWidth(w);
            setCanvasHeight(h);

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
        setStatus("Initializing...");

        let currentLPCells = lPCells.clone();

        // Wait for UI render
        await new Promise(r => setTimeout(r, 0));

        let loopCount = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            loopCount++;
            setStatus(`Analyzing: Loop ${loopCount}...`);
            await new Promise(r => setTimeout(r, 0)); // Yield to UI

            const beforeLPCells = currentLPCells.clone();
            let stepCount = 0;
            const totalStepsPerLoop = currentLPCells.vertical.length + currentLPCells.horizontal.length;

            for (let i = 0; i < currentLPCells.vertical.length; i++) {
                stepCount++;
                if (stepCount % 1 === 0) {
                    setStatus(`Analyzing: Loop ${loopCount} / Step ${stepCount}...`);
                    await new Promise(r => setTimeout(r, 0));
                }

                algoPatterns.forEach(algo =>
                    algo("vertical", i, lPHints, currentLPCells)
                );
                if (currentLPCells.isVerticalLineFixed(i)) {
                    // setLPCells(currentLPCells); 
                }
            }
            for (let i = 0; i < currentLPCells.horizontal.length; i++) {
                stepCount++;
                if (stepCount % 1 === 0) {
                    setStatus(`Analyzing: Loop ${loopCount} / Step ${stepCount}...`);
                    await new Promise(r => setTimeout(r, 0));
                }

                algoPatterns.forEach(algo =>
                    algo("horizontal", i, lPHints, currentLPCells)
                );
                if (currentLPCells.isHorizontalLineFixed(i)) {
                    // setLPCells(currentLPCells);
                }
            }

            // Intermediate update to show progress on board
            if (loopCount % 1 === 0) {
                setLPCells(currentLPCells);
                await new Promise(r => setTimeout(r, 0));
            }

            if (beforeLPCells.json === currentLPCells.json) {
                break;
            }

            if (loopCount > 1000) break; // Increased safety break from 100 to 1000
        }
        setLPCells(currentLPCells.clone()); // Ensure re-render with new reference
        setStatus("Finished");
        onAnalyzeFinish(currentLPCells);
    };

    const onAnalyzeFinish = (finalCells) => {
        // Alert removed as per user request
        console.log(`total: ${finalCells.totalCount}, fixed: ${finalCells.fixedCount}, rest: ${finalCells.restCount}`);
        console.log(finalCells.score);
    };

    return (
        <div className="analyzer-container">
            <div className="control-panel">
                <textarea
                    value={hintsJson}
                    onChange={(e) => setHintsJson(e.target.value)}
                    rows="3"
                    placeholder="Hints JSON here..."
                />
                <button className="primary" onClick={onClickAnalyze}>解析</button>
                <div className="status-badge">{status}</div>
                <label className="toggle-label">
                    <input type="checkbox" checked={isSingleColor} onChange={(e) => setIsSingleColor(e.target.checked)} />
                    単色表示
                </label>
                <button className="secondary" onClick={onClickClear}>クリア</button>
            </div>

            <LogicPuzzleFrame
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                verticalCount={verticalCount}
                horizontalCount={horizontalCount}
                lPHints={lPHints}
                lPCells={lPCells}
                cellIsShow={cellIsShow}
                isSingleColor={isSingleColor}
                onClickCell={onClickCell}
            />
        </div>
    );
};

export default LogicPuzzleAnalyzer;
