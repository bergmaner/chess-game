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

export const updateBoardSquaresArray = (currentSquareId, destinationSquareId, boardSquaresArray, promotionOption = 'blank') => {

    const newBoardSquaresArray = deepCopyArray(boardSquaresArray);

    const currentSquare = newBoardSquaresArray.find((x) => x.squareId === currentSquareId);
    const destinationElement = newBoardSquaresArray.find((x) => x.squareId === destinationSquareId);

    destinationElement.pieceColor = currentSquare.pieceColor;
    destinationElement.pieceType = promotionOption === 'blank' ? currentSquare.pieceType : promotionOption;
    destinationElement.pieceId = promotionOption === 'blank' ? currentSquare.pieceId : promotionOption + currentSquare.pieceId;


    currentSquare.pieceColor = 'blank';
    currentSquare.pieceType = 'blank';
    currentSquare.pieceId = 'blank';


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

export const isEnpassantPosible = ( currentSquareId, pawnStartingSquareId, direction ) => {

    if(gameState.moves.length === 0) return false;
    let lastMove = gameState.moves[gameState.moves.length -1];


    if(!(lastMove.to === currentSquareId && lastMove.from === pawnStartingSquareId && lastMove.pieceType === 'pawn')) return false;
    let file = currentSquareId[0];
    let rank = parseInt(currentSquareId[1]);
    rank += direction;
    let squareBehindId = file + rank;
    gameState.enPassantSquare = squareBehindId;
    return true;

}
