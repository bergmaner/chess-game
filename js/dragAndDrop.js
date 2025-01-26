import {gameState, toggleTurn} from './gameSetup.js';
import { getPossibleMoves, updateBoardSquaresArray } from './moveLogic.js';
import {getPieceAtSquare, highlightPossibleMoves, removeHighlightFromMoves} from "./utils.js";
import {checkForCheckmate, checkMoveValidAgainstCheck, displayPromotionChoices, isKingInCheck, updateBoardSquaresOpacity} from "./gameLogic.js";
import {makeMove} from "./gameHistory.js";
import {kingHasMoved, performCastling} from "./castleLogic.js";
import {performEnPassant} from "./pieceMoves.js";

export const allowDrop = (ev) => {
    ev.preventDefault();
}

export const drag = (ev) => {

    if(!gameState.allowMovement) return;

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

        console.log('legalSquares', legalSquares)

        highlightPossibleMoves(legalSquares);
        ev.dataTransfer.setData("application/json", legalSquaresJson);
    }

    ev.target.addEventListener('dragend', () => {
        removeHighlightFromMoves();
    }, { once: true });

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

    // removeHighlightFromMoves();

    legalSquares = checkMoveValidAgainstCheck(legalSquares, startingSquareId,pieceColor,pieceType);


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

        if(pieceType === 'pawn' && gameState.enPassantSquare === destinationSquareId){
            performEnPassant(piece, pieceColor, startingSquareId, destinationSquareId);
            gameState.enPassantSquare = 'blank'
            return;
        }



        if(pieceType === 'pawn' && (destinationSquareId.charAt(1) === '8' || destinationSquareId.charAt(1) === '1')){


            gameState.allowMovement = false;
            displayPromotionChoices(pieceId, pieceColor, startingSquareId, destinationSquareId, false );
            updateBoardSquaresOpacity();
            return;
        }


        destinationSquare.appendChild(piece)
        toggleTurn()
        gameState.boardSquaresArray = updateBoardSquaresArray(startingSquareId, destinationSquareId, gameState.boardSquaresArray);
        let captured = false;
        makeMove( startingSquareId, destinationSquareId, pieceType, pieceColor, captured );
        checkForCheckmate();
        return;
    }


    if(squareContent.pieceColor !== 'blank' && (legalSquares.includes(destinationSquareId)) ){

        if(pieceType === 'pawn' && (destinationSquareId.charAt(1) === '8' || destinationSquareId.charAt(1) === '1')){

            gameState.allowMovement = false;
            displayPromotionChoices(pieceId, pieceColor, startingSquareId, destinationSquareId, true );
            updateBoardSquaresOpacity();
            return;
        }

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