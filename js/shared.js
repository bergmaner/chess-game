import {gameState} from "./gameSetup.js";

export const getMovesInDirections = (startingSquareId, pieceColor, boardSquaresArray, directions) => {
    const file = startingSquareId.charAt(0);
    const rank = parseInt(startingSquareId.charAt(1));
    const legalSquares = [];

    directions.forEach(([fileStep, rankStep]) => {
        let currentFile = file;
        let currentRank = rank;

        while (true) {
            currentFile = String.fromCharCode(currentFile.charCodeAt(0) + fileStep);
            currentRank += rankStep;

            if (currentFile < 'a' || currentFile > 'h' || currentRank < 1 || currentRank > 8) break;

            const squareId = currentFile + currentRank;
            const square = getPieceAtSquare(squareId, boardSquaresArray);

            if (!square) break;

            const squareContent = square.pieceColor;

            if (squareContent === pieceColor) break;

            legalSquares.push(squareId);

            if (squareContent !== 'blank') break;
        }
    });

    return legalSquares;
};

export const getMovesFromOffsets = (startingSquareId, pieceColor, boardSquaresArray, offsets) => {
    const file = startingSquareId.charAt(0);
    const rank = parseInt(startingSquareId.charAt(1));
    const legalSquares = [];

    offsets.forEach(([fileStep, rankStep]) => {
        const newFile = String.fromCharCode(file.charCodeAt(0) + fileStep);
        const newRank = rank + rankStep;

        if (newFile >= 'a' && newFile <= 'h' && newRank >= 1 && newRank <= 8) {
            const squareId = newFile + newRank;
            const square = getPieceAtSquare(squareId, boardSquaresArray);

            if (!square) return;

            const squareContent = square.pieceColor;

            if (squareContent === 'blank' || squareContent !== pieceColor) {
                legalSquares.push(squareId);
            }
        }
    });

    return legalSquares;
};




export const getPieceAtSquare = (squareId, boardSquaresArray) => {
    console.log('ddd', boardSquaresArray, gameState.boardSquaresArray)
    if (!Array.isArray(boardSquaresArray)) {
        return null;
    }
    const square = boardSquaresArray?.find((x) => x.squareId === squareId);
    return square || null;
};