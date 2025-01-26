import {gameState} from "./gameSetup.js";

export const makeMove = ( startingSquareId, destinationSquareId, pieceType, pieceColor, captured, promotedTo = 'blank' ) => {

    gameState.moves.push({
        from: startingSquareId,
        to: destinationSquareId,
        pieceType: pieceType,
        pieceColor: pieceColor,
        captured: captured,
        promotedTo: promotedTo
    });

}

export const getKingLastMove = (color) => {

    let kingLastMove = [...gameState.moves].reverse().find(
        (x) => x.pieceType === 'king' && x.pieceColor === color
    );

    if (kingLastMove === undefined) return color === 'white' ? 'e1' : 'e8';

    return kingLastMove.to;
};