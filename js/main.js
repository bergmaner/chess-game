import {setupBoardSquares, fillBoardSquaresArray, setupPieces} from './gameSetup.js';

const boardSquares = document.getElementsByClassName('square');

setupBoardSquares(boardSquares);
fillBoardSquaresArray(boardSquares);
setupPieces();
