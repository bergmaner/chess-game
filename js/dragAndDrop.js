import {gameState, toggleTurn} from './gameSetup.js';
import { getPossibleMoves, updateBoardSquaresArray } from './moveLogic.js';
import {getPieceAtSquare} from "./utils.js";
import {checkForCheckmate, checkMoveValidAgainstCheck, isKingInCheck} from "./gameLogic.js";
import {makeMove} from "./gameHistory.js";
import {kingHasMoved, performCastling} from "./castleLogic.js";

export const allowDrop = (ev) => {
    ev.preventDefault();
}

export const drag = (ev) => {
    const piece = ev.target;
    const pieceColor = piece.getAttribute('color');
    const pieceType = piece.classList[1];
    const pieceId = piece.id;
    const {isWhiteTurn} = gameState;



    if ((isWhiteTurn && pieceColor === "white") || (!isWhiteTurn && pieceColor === 'black')) {
        const startingSquareId = piece.parentNode.id;
        ev.dataTransfer.setData("text", piece.id + ' ' + startingSquareId);
        const pieceObject = { pieceColor: pieceColor, pieceType:pieceType,pieceId:pieceId }

        let legalSquares = getPossibleMoves(startingSquareId, pieceObject, gameState.boardSquaresArray);
        let legalSquaresJson = JSON.stringify(legalSquares);
        ev.dataTransfer.setData("application/json", legalSquaresJson);
    }
}

export const drop = (ev) => {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");

    let [pieceId, startingSquareId] = data.split(' ');
    let legalSquaresJson = ev.dataTransfer.getData('application/json');

    if(legalSquaresJson.length === 0) return;
    let legalSquares = JSON.parse(legalSquaresJson);

    const piece = document.getElementById(pieceId);
    const pieceColor = piece.getAttribute('color');
    const pieceType = piece.classList[1];
    const destinationSquare = ev.currentTarget;
    let destinationSquareId = destinationSquare.id;
    legalSquares = checkMoveValidAgainstCheck(legalSquares, startingSquareId,pieceColor,pieceType);

    console.log('legalSquares', legalSquares)

    if(pieceType === 'king'){
        let isCheck = isKingInCheck(destinationSquareId, pieceColor, gameState.boardSquaresArray);

        if(isCheck) return;

    }
    let squareContent = getPieceAtSquare(destinationSquareId, gameState.boardSquaresArray);
    if((squareContent.pieceColor === 'blank') && (legalSquares.includes(destinationSquareId))){

        let isCheck = false;

        if(pieceType === 'king') isCheck = isKingInCheck(startingSquareId, pieceColor, gameState.boardSquaresArray);
        if(pieceType === 'king' && !kingHasMoved(pieceColor) && gameState.castlingSquares.includes(destinationSquareId) && !isCheck){
            performCastling(piece, pieceColor, startingSquareId, destinationSquareId, gameState.boardSquaresArray);
            return;
        }
        if(pieceType === 'king' && !kingHasMoved(pieceColor) && gameState.castlingSquares.includes(destinationSquareId) && isCheck) return;
        destinationSquare.appendChild(piece)
        toggleTurn()
        gameState.boardSquaresArray = updateBoardSquaresArray(startingSquareId, destinationSquareId, gameState.boardSquaresArray);
        let captured = false;
        makeMove( startingSquareId, destinationSquareId, pieceType, pieceColor, captured );
        checkForCheckmate();
        return;
    }


    if(squareContent.pieceColor !== 'blank' && (legalSquares.includes(destinationSquareId)) ){
        while(destinationSquare.firstChild){
            destinationSquare.removeChild(destinationSquare.firstChild);
        }

        destinationSquare.appendChild(piece);
        toggleTurn()
        gameState.boardSquaresArray = updateBoardSquaresArray(startingSquareId, destinationSquareId, gameState.boardSquaresArray);
        let captured = true;
        makeMove( startingSquareId, destinationSquareId, pieceType, pieceColor, captured );
        checkForCheckmate();
        return;

    }



}