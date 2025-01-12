import { getPawnMoves,getKnightMoves, getRookMoves, getBishopMoves, getQueenMoves, getKingMoves } from './pieceMoves.js';
import {deepCopyArray, getPieceAtSquare} from "./utils.js";
import {checkMoveValidAgainstCheck} from "./gameLogic.js";
import {gameState} from "./gameSetup.js";

export const moveGenerators = {
    pawn: getPawnMoves,
    knight: getKnightMoves,
    rook: getRookMoves,
    bishop: getBishopMoves,
    queen: getQueenMoves,
    king: getKingMoves
};

export const getPossibleMoves = (startingSquareId, piece, boardSquaresArray) => {
    const generator = moveGenerators[piece.pieceType];
    return generator ? generator(startingSquareId, piece.pieceColor, boardSquaresArray) : [];
}

export const updateBoardSquaresArray = (currentSquareId, destinationSquareId, boardSquaresArray) => {

    const newBoardSquaresArray = deepCopyArray(boardSquaresArray);

    const currentSquare = newBoardSquaresArray.find((x) => x.squareId === currentSquareId);
    const destinationElement = newBoardSquaresArray.find((x) => x.squareId === destinationSquareId);

    destinationElement.pieceColor = currentSquare.pieceColor;
    destinationElement.pieceType = currentSquare.pieceType;
    destinationElement.pieceId = currentSquare.pieceId;

    currentSquare.pieceColor = 'blank';
    currentSquare.pieceType = 'blank';
    currentSquare.pieceId = 'blank';

    console.log('lll',gameState.boardSquaresArray)

    return newBoardSquaresArray;



}

export const getAllPossibleMoves = (squaresArray, color) => {

    return squaresArray
        .filter((square) => square.pieceColor === color)
        .flatMap((square) => {
            const { pieceColor, pieceType, pieceId } = getPieceAtSquare(square.squareId, squaresArray);

            if (pieceId === 'blank') return [];

            const squaresArrayCopy = deepCopyArray(squaresArray);
            const pieceObject = { pieceColor, pieceType, pieceId };

            let legalSquares = getPossibleMoves(square.squareId, pieceObject, squaresArrayCopy);

            legalSquares = checkMoveValidAgainstCheck(legalSquares, square.squareId, pieceColor, pieceType);

            return legalSquares;
        });
};