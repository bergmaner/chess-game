import {
    checkPawnDiagonalCaptures,
    getBishopMoves, getKingMoves,
    getKnightMoves,
    getRookMoves
} from "./pieceMoves.js";
import {deepCopyArray, getPieceAtSquare, showAlert} from "./utils.js";
import { gameState} from "./gameSetup.js";
import {getAllPossibleMoves, updateBoardSquaresArray} from "./moveLogic.js";

export const isKingInCheck = (squareId, pieceColor, boardSquaresArray) => {

    const checkRules = [
        {
            moves: getRookMoves,
            types: ['rook', 'queen'],
        },
        {
            moves: getBishopMoves,
            types: ['bishop', 'queen'],
        },
        {
            moves: checkPawnDiagonalCaptures,
            types: ['pawn'],
        },
        {
            moves: getKnightMoves,
            types: ['knight'],
        },
        {
            moves: getKingMoves,
            types: ['king'],
        },
    ];

    for (const rule of checkRules) {

        const legalSquares = rule.moves(squareId, pieceColor, boardSquaresArray);


        for (const squareId of legalSquares) {
            const pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);


            if (rule.types.includes(pieceProperties.pieceType) && pieceColor !== pieceProperties.pieceColor) {
                return true;
            }
        }
    }

    return false;
};

export const checkMoveValidAgainstCheck = (legalSquares, startingSquareId, pieceColor, pieceType) => {

    const kingSquare = pieceType === 'king'
        ? startingSquareId
        : (pieceColor === 'white' ? gameState.whiteKingSquare : gameState.blackKingSquare);


    return legalSquares.filter((destinationId) => isMoveValidAgainstCheck(
        startingSquareId,
        destinationId,
        pieceColor,
        pieceType,
        kingSquare
    ));
};


const isMoveValidAgainstCheck = (startingSquareId, destinationId, pieceColor, pieceType, kingSquare) => {
    const boardSquaresArrayCopy = deepCopyArray(gameState.boardSquaresArray);
    const updatedBoard = updateBoardSquaresArray(startingSquareId, destinationId, boardSquaresArrayCopy);


    if (pieceType === 'king') {
        return !isKingInCheck(destinationId, pieceColor, updatedBoard);
    }

    return !isKingInCheck(kingSquare, pieceColor, updatedBoard);
};

export const checkForCheckmate = () => {

    let kingSquare = gameState.isWhiteTurn ? gameState.whiteKingSquare : gameState.blackKingSquare;
    let pieceColor = gameState.isWhiteTurn ? 'white' : 'black';
    let boardSquaresArrayCopy = deepCopyArray(gameState.boardSquaresArray)
    let kingIsCheck = isKingInCheck(kingSquare, pieceColor, boardSquaresArrayCopy);
    if(!kingIsCheck) return;
    let possibleMoves = getAllPossibleMoves(boardSquaresArrayCopy, pieceColor);
    if(possibleMoves.length > 0) return;

    let message = '';
    gameState.isWhiteTurn ? (message = 'Black Wins') : (message = 'White Wins' );
    showAlert(message);

}