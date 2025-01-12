import {gameState, toggleTurn} from './gameSetup.js';
import { getPossibleMoves, updateBoardSquaresArray } from './moveLogic.js';
import {getPieceAtSquare} from "./shared.js";
import {isKingInCheck} from "./gameLogic.js";

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

    if(pieceType === 'king'){
        let isCheck = isKingInCheck(destinationSquareId, pieceColor, gameState.boardSquaresArray);

        if(isCheck) return;
    }

    let squareContent = getPieceAtSquare(destinationSquareId, gameState.boardSquaresArray);
    if((squareContent.pieceColor === 'blank') && (legalSquares.includes(destinationSquareId))){
        destinationSquare.appendChild(piece)
        toggleTurn()
        updateBoardSquaresArray(startingSquareId, destinationSquareId, gameState.boardSquaresArray);
        return;
    }
    if(squareContent.pieceColor !== 'blank' && (legalSquares.includes(destinationSquareId)) ){
        while(destinationSquare.firstChild){
            destinationSquare.removeChild(destinationSquare.firstChild);
        }

        destinationSquare.appendChild(piece);
        toggleTurn()
        updateBoardSquaresArray(startingSquareId, destinationSquareId, gameState.boardSquaresArray);
        return;

    }
}