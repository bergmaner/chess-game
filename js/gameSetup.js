import {allowDrop, drag, drop} from './dragAndDrop.js';
import {clearPromotionOptions} from "./gameLogic.js";

const pieces = document.getElementsByClassName('piece');
const piecesImages = document.getElementsByClassName('pieceImg');
export const gameState = {
    isWhiteTurn: true,
    boardSquaresArray: [],
    positionArray: [],
    moves: [],
    castlingSquares: [ 'g1', 'g8', 'c1', 'c8' ],
    enPassantSquare: 'blank',
    allowMovement: true,
    activeArrows: new Map(),
};

export const setupPieces = () => {
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].addEventListener('dragstart', drag);
        pieces[i].setAttribute('draggable', true);
        pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
    }

    for (let i = 0; i < piecesImages.length; i++) {
        piecesImages[i].setAttribute('draggable', false);
    }
}

export const toggleTurn = () => {
    gameState.isWhiteTurn = !gameState.isWhiteTurn;
}



export const setupBoardSquares = (boardSquares) => {
    for (let i = 0; i < boardSquares.length; i++) {
        boardSquares[i].addEventListener('dragover', allowDrop);
        boardSquares[i].addEventListener('drop', drop);
        let row = 8 - Math.floor(i / 8);
        let column = String.fromCharCode(97 + (i % 8));
        let square = boardSquares[i];
        square.id = column + row;
    }
}


export const addBoardListeners = (chessBoard) => {
    chessBoard.addEventListener("click", clearPromotionOptions);
};


export const fillBoardSquaresArray = (boardSquares) => {



    for (let i = 0; i < boardSquares.length; i++) {
        let row = 8 - Math.floor(i / 8);
        let column = String.fromCharCode(97 + (i % 8));
        let square = boardSquares[i];
        square.id = column + row;

        let color = 'blank';
        let pieceType = 'blank';
        let pieceId = 'blank';

        if (square.querySelector('.piece')) {
            const piece = square.querySelector('.piece');
            color = piece.getAttribute("color");
            pieceType = piece.classList[1];
            pieceId = piece.id;

        }




        const arrayElement = {
            squareId: square.id,
            pieceColor: color,
            pieceType: pieceType,
            pieceId: pieceId
        };
        gameState.boardSquaresArray.push(arrayElement);

    }

}
