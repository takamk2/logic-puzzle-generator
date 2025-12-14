
import React, { useState, useEffect, useCallback } from 'react';
import LogicPuzzleFrame from './LogicPuzzleFrame';
import LPHints from '../models/LPHints';
import LPCells from '../models/LPCells';

const LogicPuzzleGenerator = () => {
    const [verticalCount, setVerticalCount] = useState(5);
    const [horizontalCount, setHorizontalCount] = useState(5);
    const [canvasWidth] = useState(500);
    const [canvasHeight] = useState(500);
    const [lPHints, setLPHints] = useState(null);
    const [lPCells, setLPCells] = useState(null);
    const [cellIsShow, setCellIsShow] = useState(true);

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
