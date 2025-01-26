import {setupBoardSquares, fillBoardSquaresArray, setupPieces, addBoardListeners} from './gameSetup.js';

const boardSquares = document.getElementsByClassName('square');
const chessBoard = document.getElementById('board');

addBoardListeners(chessBoard);
setupBoardSquares(boardSquares);
setupPieces();
fillBoardSquaresArray(boardSquares);


