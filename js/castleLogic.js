import {gameState, toggleTurn} from "./gameSetup.js";
import {checkForEndGame, isKingInCheck} from "./gameLogic.js";
import {updateBoardSquaresArray} from "./moveLogic.js";
import {makeMove} from "./gameHistory.js";

export const kingHasMoved = ( pieceColor ) => {
    const result = gameState.moves.find((x) => x.pieceColor === pieceColor && x.pieceType === 'king');
    return result !== undefined;
};

export const rookHasMoved = ( pieceColor, startingSquareId ) => {
    const result = gameState.moves.find(
        (x) => x.pieceColor === pieceColor && x.pieceType === 'rook' && x.from === startingSquareId
    );
    return result !== undefined;
};

export const isShortCastlePossible = ( pieceColor, boardSquaresArray ) => {

    let rank = pieceColor === 'white' ? '1' : '8';
    let fSquare = boardSquaresArray.find(( x ) => x.squareId === `f${rank}`);
    let gSquare = boardSquaresArray.find(( x ) => x.squareId === `g${rank}`);

    if(fSquare.pieceColor !== 'blank' || gSquare.pieceColor !== 'blank' || kingHasMoved(pieceColor) || rookHasMoved(pieceColor, `h${rank}`)){
        return 'blank';
    }

    return `g${rank}`;

}

export const isLongCastlePossible = ( pieceColor, boardSquaresArray ) => {

    let rank = pieceColor === 'white' ? '1' : '8';
    let dSquare = boardSquaresArray.find(( x ) => x.squareId === `d${rank}`);
    let cSquare = boardSquaresArray.find(( x ) => x.squareId === `c${rank}`);
    let bSquare = boardSquaresArray.find(( x ) => x.squareId === `b${rank}`);

    if(dSquare.pieceColor !== 'blank' || cSquare.pieceColor !== 'blank' || bSquare.pieceColor !== 'blank'  || kingHasMoved(pieceColor) || rookHasMoved(pieceColor, `h${rank}`)){
        return 'blank';
    }

    return `c${rank}`;

}

export const getCastlingMovesForKing = ( pieceColor, boardSquaresArray ) => {
    const castlingMoves = [];

    const shortCastleMove = isShortCastlePossible(pieceColor, boardSquaresArray);
    if (shortCastleMove !== 'blank') {
        castlingMoves.push(shortCastleMove);
    }

    const longCastleMove = isLongCastlePossible(pieceColor, boardSquaresArray);
    if (longCastleMove !== 'blank') {
        castlingMoves.push(longCastleMove);
    }

    return castlingMoves;
};

export const performCastling = (piece, pieceColor, startingSquareId, destinationSquareId, boardSquaresArray) => {
    const castlingConfig = {
        g1: { rookId: 'rookh1', rookDestinationSquareId: 'f1', checkSquareId: 'f1' },
        c1: { rookId: 'rooka1', rookDestinationSquareId: 'd1', checkSquareId: 'd1' },
        g8: { rookId: 'rookh8', rookDestinationSquareId: 'f8', checkSquareId: 'f8' },
        c8: { rookId: 'rooka8', rookDestinationSquareId: 'd8', checkSquareId: 'd8' }
    };

    const config = castlingConfig[destinationSquareId];
    if (!config) return;

    const { rookId, rookDestinationSquareId, checkSquareId } = config;

    if (isKingInCheck(checkSquareId, pieceColor, boardSquaresArray)) return;

    const rook = document.getElementById(rookId);
    const rookDestinationSquare = document.getElementById(rookDestinationSquareId);
    rookDestinationSquare.appendChild(rook);
    gameState.boardSquaresArray = updateBoardSquaresArray(rook.id.slice(-2), rookDestinationSquareId, boardSquaresArray);

    const destinationSquare = document.getElementById(destinationSquareId);
    destinationSquare.appendChild(piece);
    toggleTurn();
    gameState.boardSquaresArray = updateBoardSquaresArray(startingSquareId, destinationSquareId, boardSquaresArray);

    const captured = false;
    makeMove(startingSquareId, destinationSquareId, 'king', pieceColor, captured);

    checkForEndGame();
    return;
};

export const calculateCastlingRights = () => {
    const castlingRights = [
        { color: 'white', rookSquare: 'h1', notation: 'K' },
        { color: 'white', rookSquare: 'a1', notation: 'Q' },
        { color: 'black', rookSquare: 'h8', notation: 'k' },
        { color: 'black', rookSquare: 'a8', notation: 'q' },
    ];

    return castlingRights
        .filter(({ color, rookSquare }) => !kingHasMoved(color) && !rookHasMoved(color, rookSquare))
        .map(({ notation }) => notation)
        .join('') || '-';
};

