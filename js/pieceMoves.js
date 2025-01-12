import { getMovesInDirections, getMovesFromOffsets } from './utils.js';

export const getPawnMoves = (startingSquareId, pieceColor, boardSquaresArray) => {
    return [
        ...checkPawnDiagonalCaptures(startingSquareId, pieceColor, boardSquaresArray),
        ...checkPawnForwardMoves(startingSquareId, pieceColor, boardSquaresArray)
    ];
}

export const checkPawnDiagonalCaptures = (startingSquareId, pieceColor, boardSquaresArray) =>{

    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);

    let currentFile = file;
    let currentRank = rankNumber;
    let currentSquareId = currentRank + currentFile;
    let legalSquares = [];
    const direction = pieceColor === 'white' ? 1 : -1;

    currentRank += direction;

    for (let i=-1; i<= 1; i+=2){
        currentFile = String.fromCharCode(file.charCodeAt(0) + i);
        if(currentFile >= 'a' && currentFile <= 'h'){
            currentSquareId = currentFile + currentRank;
            let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId)



            const squareContent = currentSquare.pieceColor;
            if(squareContent !== 'blank' && squareContent !== pieceColor)
                legalSquares.push(currentSquareId)
        }
    }
    return legalSquares

}

export const checkPawnForwardMoves = (
    startingSquareId,
    pieceColor,
    boardSquaresArray
) => {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);

    let legalSquares = [];
    let currentFile = file;
    let currentRank = rankNumber;
    let currentSquareId = currentRank + currentFile;

    const direction = pieceColor === 'white' ? 1 : -1;
    currentRank += direction;

    currentSquareId = currentFile + currentRank;
    let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId)
    let squareContent = currentSquare.pieceColor;
    if(squareContent !== 'blank') return legalSquares;
    legalSquares.push(currentSquareId)

    if(rankNumber !== 2 && rankNumber !== 7) return legalSquares;
    currentRank += direction;
    currentSquareId = currentFile + currentRank;
    currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId)
    squareContent = currentSquare.pieceColor;
    if(squareContent !== 'blank')
        return legalSquares;
    legalSquares.push(currentSquareId)

    return legalSquares;
}

export const getKingMoves = (startingSquareId, pieceColor, boardSquaresArray) => {
    const kingOffsets = [[0, 1], [0, -1], [1, 1], [1, -1], [-1, 0], [-1, -1], [-1, 1], [1, 0]];
    return getMovesFromOffsets(startingSquareId, pieceColor, boardSquaresArray, kingOffsets);
}

export const getKnightMoves = (startingSquareId, pieceColor, boardSquaresArray) => {
    const knightOffsets = [[-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1]];
    return getMovesFromOffsets(startingSquareId, pieceColor, boardSquaresArray, knightOffsets);
}

export const getRookMoves = (startingSquareId, pieceColor, boardSquaresArray) => {
    const directions = [[0, 1], [0, -1], [-1, 0], [1, 0]];
    return getMovesInDirections(startingSquareId, pieceColor, boardSquaresArray, directions);
}

export const getBishopMoves = (startingSquareId, pieceColor, boardSquaresArray) => {
    const directions = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
    return getMovesInDirections(startingSquareId, pieceColor, boardSquaresArray, directions);
}

export const getQueenMoves = (startingSquareId, pieceColor, boardSquaresArray) => {
    return [
        ...getBishopMoves(startingSquareId, pieceColor, boardSquaresArray),
        ...getRookMoves(startingSquareId, pieceColor, boardSquaresArray)
    ];
}