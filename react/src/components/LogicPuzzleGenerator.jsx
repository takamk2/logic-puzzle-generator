
import React, { useState, useEffect, useCallback } from 'react';
import LogicPuzzleFrame from './LogicPuzzleFrame';
import LPHints from '../models/LPHints';
import LPCells from '../models/LPCells';
import patterns from '../algorithm/patterns.js';

const LogicPuzzleGenerator = () => {
    const [verticalCount, setVerticalCount] = useState(5);
    const [horizontalCount, setHorizontalCount] = useState(5);
    const [canvasWidth] = useState(500);
    const [canvasHeight] = useState(500);
    const [lPHints, setLPHints] = useState(null);
    const [lPCells, setLPCells] = useState(null);

    const [cellIsShow, setCellIsShow] = useState(true);
    const [verificationResult, setVerificationResult] = useState('');

    // Initial setup and when counts change
    useEffect(() => {
        const newCells = LPCells.empty(verticalCount, horizontalCount);
        setLPCells(newCells);
        setLPHints(LPHints.createByLPCells(newCells));
    }, [verticalCount, horizontalCount]);

    // Update hints when cells change
    useEffect(() => {
        if (lPCells) {
            setLPHints(LPHints.createByLPCells(lPCells));
        }
    }, [lPCells]);

    const onClickCell = useCallback((cellId) => {
        setLPCells(prev => prev.updateNextState(cellId));
    }, []);

    const onClickShowButton = () => {
        setCellIsShow(prev => !prev);
    };

    // Handlers for inputs to ensure number type
    const onChangeVertical = (e) => setVerticalCount(Number(e.target.value));
    const onChangeHorizontal = (e) => setHorizontalCount(Number(e.target.value));

    const verifySolvability = () => {
        if (!lPHints) return;
        setVerificationResult("Checking...");

        // Use timeout to allow UI to update "Checking..." before heavy calculation
        setTimeout(() => {
            const testCells = LPCells.empty(verticalCount, horizontalCount);
            let loopCount = 0;
            while (true) {
                loopCount++;
                const beforeJson = testCells.json;

                // Vertical Pass
                for (let i = 0; i < testCells.verticalCount; i++) {
                    patterns.forEach(algo => algo("vertical", i, lPHints, testCells));
                }

                // Horizontal Pass
                for (let i = 0; i < testCells.horizontalCount; i++) {
                    patterns.forEach(algo => algo("horizontal", i, lPHints, testCells));
                }

                if (beforeJson === testCells.json) break;
                if (loopCount > 20) break;
            }

            if (testCells.restCount === 0) {
                setVerificationResult("✅ 論理的に解けます (Solvable)");
            } else {
                setVerificationResult(`⚠️ 論理だけでは解けません (Unsolvable, Rest: ${testCells.restCount})`);
            }
        }, 10);
    };

    return (
        <div>
            <p>
                <label>
                    縦:
                    <input type="number" value={verticalCount} onChange={onChangeVertical} />
                </label>
            </p>
            <p>
                <label>
                    横:
                    <input type="number" value={horizontalCount} onChange={onChangeHorizontal} />
                </label>
            </p>
            <p>
                <button onClick={onClickShowButton}>
                    {cellIsShow ? 'セル非表示' : 'セル表示'}
                </button>
                <button onClick={verifySolvability} style={{ marginLeft: '10px' }}>
                    論理チェック
                </button>
                <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>{verificationResult}</span>
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
            <dl>
                <dt>Hints:</dt>
                <dd>
                    <textarea
                        value={lPHints ? lPHints.json : ''}
                        rows="5"
                        cols="50"
                        readOnly
                    />
                </dd>
                <dt>Cells:</dt>
                <dd>
                    <textarea
                        value={lPCells ? lPCells.json : ''}
                        rows="5"
                        cols="50"
                        readOnly
                    />
                </dd>
            </dl>
        </div>
    );
};

export default LogicPuzzleGenerator;
