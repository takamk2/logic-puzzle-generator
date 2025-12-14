
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
    const [status, setStatus] = useState("Ready");
    const [isMonochrome, setIsMonochrome] = useState(false);

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
            {/* Manual Inputs need to trigger resetBoard */}
            {/* Note: Generator has inputs, Analyzer usually reads from JSON but can share frame props */}
            {/* Analyzer doesn't expose manual size inputs in the original code snippet above, 
                 but LogicPuzzleGenerator did. Analyzing LogicPuzzleAnalyzer again...
                 Ah, Analyzer DOES NOT seem to have size inputs in the render block I saw previously? 
                 Let's check the Render block carefully. 
                 Wait, I previously saw LogicPuzzleGenerator code in step 442, but read LogicPuzzleAnalyzer in step 492.
                 LogicPuzzleAnalyzer Render (lines 161-191) ONLY has JSON textarea.
                 It does NOT have vertical/horizontal count inputs visible to user.
                 So `handleVerticalChange` is not needed for UI.
                 The state `verticalCount` and `horizontalCount` are internal or driven by JSON.
                 Initial useEffect sets them to 5,5.
                 Wait, if I remove the effect, initial load (empty) might result in null lPCells?
                 The `useEffect([], ...)` sets initial. That is fine.
                 So removing the `[verticalCount, horizontalCount]` effect is SAFE because user cannot manually change valid in Analyzer UI.
              */}
            <p>
                <button onClick={onClickAnalyze}>解析</button>
                <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{status}</span>
                <label style={{ marginLeft: '15px' }}>
                    <input type="checkbox" checked={isMonochrome} onChange={(e) => setIsMonochrome(e.target.checked)} />
                    モノクロ表示
                </label>
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
                isMonochrome={isMonochrome}
                onClickCell={onClickCell}
            />
        </div>
    );
};

export default LogicPuzzleAnalyzer;
