
import React, { useEffect, useRef, useMemo } from 'react';
import LPCellPoints from '../models/LPCellPoints';

// Default constants
const MARGIN_X = 10;
const MARGIN_Y = 10;
const HINT_SIZE = 20;

const LogicPuzzleFrame = ({
    canvasWidth = 300,
    canvasHeight = 300,
    verticalCount = 5,
    horizontalCount = 5,
    lPCells = null,
    lPHints = null,
    cellIsShow = true,
    isMonochrome = false,
    onClickCell
}) => {
    const canvasRef = useRef(null);

    // Computed equivalents using useMemo
    const lPCellPoints = useMemo(() => {
        // We need to calculate cellSize first inside useMemo because it depends on canvas size
        // But wait, cellSize is also used for styles etc.
        // Let's re-calculate it here.

        // hintWidth/Height
        const leftHintMaxCount = Math.floor(horizontalCount / 2 + (horizontalCount % 2));
        const topHintMaxCount = Math.floor(verticalCount / 2 + (verticalCount % 2));
        const hintWidth = leftHintMaxCount * HINT_SIZE;
        const hintHeight = topHintMaxCount * HINT_SIZE;

        // cellSize
        const w = Math.floor(
            (canvasWidth - MARGIN_X * 2 - hintWidth) / horizontalCount
        );
        const h = Math.floor(
            (canvasHeight - MARGIN_Y * 2 - hintHeight) / verticalCount
        );
        const cellSize = Math.min(w, h);

        return new LPCellPoints({
            marginX: MARGIN_X,
            marginY: MARGIN_Y,
            horizontalCount,
            verticalCount,
            cellSize,
            hintSize: HINT_SIZE
        });
    }, [horizontalCount, verticalCount, canvasWidth, canvasHeight]);

    // Derived values for rendering
    const topHintMaxCount = Math.floor(verticalCount / 2 + (verticalCount % 2));
    const leftHintMaxCount = Math.floor(horizontalCount / 2 + (horizontalCount % 2));
    const hintWidth = leftHintMaxCount * HINT_SIZE;
    const hintHeight = topHintMaxCount * HINT_SIZE;
    const leftSpaceWidth = MARGIN_X + hintWidth;
    const topSpaceHeight = MARGIN_Y + hintHeight;
    const cellSize = lPCellPoints.cellSize; // Get from the created object
    const cellsWidth = cellSize * horizontalCount;
    const cellsHeight = cellSize * verticalCount;


    // Drawing functions
    const render = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Helper functions for drawing
        const clearRect = (x, y, w, h) => context.clearRect(x, y, w, h);
        const fillRect = (x, y, w, h, options = {}) => {
            context.fillStyle = options.fillStyle || "#000000";
            context.fillRect(x, y, w, h);
        };
        const fillText = (text, x, y, size, options = {}) => {
            context.fillStyle = options.fillStyle || "#000000";
            context.fillText(text, x, y, size);
        };
        const strokeLine = (x1, y1, x2, y2, options = {}) => {
            context.lineWidth = options.lineWidth !== undefined ? options.lineWidth : 1;
            context.strokeStyle = options.strokeStyle || "#000000";
            context.setLineDash(options.lineDash || []);
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();
        };
        const strokeNoPaint = (x, y, w, h, options) => {
            strokeLine(x, y, x + w, y + h, options);
            strokeLine(x + w, y, x, y + h, options);
        };

        // Render Logic
        // resetCanvas
        clearRect(0, 0, canvas.width, canvas.height);
        fillRect(0, 0, canvas.width, canvas.height, { fillStyle: "#ffffff" });

        // renderHints
        if (lPHints) {
            context.textAlign = "center";
            // Vertical hints (top)
            lPHints.vertical.forEach((line, i) => {
                const reversed = line.slice().reverse();
                reversed.forEach((hint, j) => {
                    fillText(
                        String(hint),
                        leftSpaceWidth + cellSize * i + cellSize / 2,
                        topSpaceHeight - (HINT_SIZE * j + 8),
                        HINT_SIZE
                    );
                });
            });
            // Horizontal hints (left)
            lPHints.horizontal.forEach((line, i) => {
                const reversed = line.slice().reverse();
                reversed.forEach((hint, j) => {
                    fillText(
                        String(hint),
                        leftSpaceWidth - (HINT_SIZE * j + 8),
                        topSpaceHeight + cellSize * i + cellSize / 2,
                        HINT_SIZE
                    );
                });
            });
        }

        // renderCells
        if (lPCells && cellIsShow) {
            lPCells.cellIds.forEach(cellId => {
                const cell = lPCells.getCell(cellId);
                const point = lPCellPoints.getPoint(cell.id);
                if (!point) return;

                fillRect(point.x, point.y, point.w, point.h, { fillStyle: "#ffffff" });
                switch (cell.s) {
                    case 1:
                        fillRect(point.x, point.y, point.w, point.h, { fillStyle: isMonochrome ? "#000000" : cell.c });
                        break;
                    case 2:
                        strokeNoPaint(point.x, point.y, point.w, point.h, { strokeStyle: isMonochrome ? "#000000" : cell.c });
                        break;
                    default:
                        break;
                }
            });
        }

        // renderFrame
        for (let i = 0; i < verticalCount + 1; i++) {
            const isFirstLine = i === 0;
            const isLastLine = i === verticalCount;
            const isSeparationLine = !isFirstLine && !isLastLine && i % 5 === 0;
            const lineWidth = isSeparationLine ? 2 : 1;
            const lineDash = isFirstLine || isLastLine || isSeparationLine ? [] : [1, 1];
            strokeLine(
                leftSpaceWidth,
                topSpaceHeight + cellSize * i,
                leftSpaceWidth + cellsWidth,
                topSpaceHeight + cellSize * i,
                { lineWidth, lineDash }
            );
        }
        for (let i = 0; i < horizontalCount + 1; i++) {
            const isFirstLine = i === 0;
            const isLastLine = i === horizontalCount;
            const isSeparationLine = !isFirstLine && !isLastLine && i % 5 === 0;
            const lineWidth = isSeparationLine ? 2 : 1;
            const lineDash = isFirstLine || isLastLine || isSeparationLine ? [] : [1, 1];
            strokeLine(
                leftSpaceWidth + cellSize * i,
                topSpaceHeight,
                leftSpaceWidth + cellSize * i,
                topSpaceHeight + cellsHeight,
                { lineWidth, lineDash }
            );
        }
    };

    // Re-render when props change
    useEffect(() => {
        render();
    }, [
        lPCells,
        lPHints,
        cellIsShow,
        isMonochrome,
        canvasWidth,
        canvasHeight,
        verticalCount,
        horizontalCount,
        lPCellPoints // implicitly includes dependencies
    ]);

    const onClickCanvas = (event) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Get mouse position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;

        lPCellPoints.cellIds.forEach(cellId => {
            const point = lPCellPoints.getPoint(cellId);
            if (
                point.x <= offsetX &&
                offsetX <= point.x + point.w &&
                point.y <= offsetY &&
                offsetY <= point.y + point.h
            ) {
                if (onClickCell) {
                    onClickCell(cellId);
                }
            }
        });
    };

    return (
        <canvas
            width={canvasWidth}
            height={canvasHeight}
            onClick={onClickCanvas}
            ref={canvasRef}
            style={{ border: '1px solid #ccc' }} // Optional: add border to see canvas
        />
    );
};

export default LogicPuzzleFrame;
