import {
    checkPawnDiagonalCaptures,
    getBishopMoves, getKingMoves,
    getKnightMoves,
    getRookMoves
} from "./pieceMoves.js";
import {getPieceAtSquare} from "./shared.js";


export const isKingInCheck = (squareId, pieceColor, boardSquaresArray) => {

    let legalSquares = getRookMoves(squareId, pieceColor, boardSquaresArray);


    for (let squareId of legalSquares){

        let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
        if( (pieceProperties.pieceType === 'rook' || pieceProperties.pieceType === 'queen') && pieceColor !== pieceProperties.pieceColor) return true;

    }
    legalSquares = getBishopMoves(squareId, pieceColor, boardSquaresArray);

    for (let squareId of legalSquares){
        let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
        if( (pieceProperties.pieceType === 'bishop' || pieceProperties.pieceType === 'queen') && pieceColor !== pieceProperties.pieceColor) return true;

    }

    legalSquares = checkPawnDiagonalCaptures(squareId, pieceColor, boardSquaresArray);
    for (let squareId of legalSquares){
        let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
        if( pieceProperties.pieceType === 'pawn'&& pieceColor !== pieceProperties.pieceColor) return true;

    }

    legalSquares = getKnightMoves(squareId, pieceColor, boardSquaresArray);
    for (let squareId of legalSquares){
        let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
        if( pieceProperties.pieceType === 'knight'&& pieceColor !== pieceProperties.pieceColor) return true;

    }


    legalSquares = getKingMoves(squareId, pieceColor, boardSquaresArray);
    for (let squareId of legalSquares){
        let pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);
        if( pieceProperties.pieceType === 'king'&& pieceColor !== pieceProperties.pieceColor) return true;

    }

    return false;


}