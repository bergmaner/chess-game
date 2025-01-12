import { getPawnMoves,getKnightMoves, getRookMoves, getBishopMoves, getQueenMoves, getKingMoves } from './pieceMoves.js';
import {deepCopyArray} from "./utils.js";

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

    return newBoardSquaresArray;

}