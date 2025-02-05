import {setupBoardSquares, fillBoardSquaresArray, setupPieces, addBoardListeners, gameState} from './gameSetup.js';
import { clearArrows, initArrows } from './arrows.js';
import {generateFEN} from "./utils.js";
import {displayEvaluation, getEvaluation} from "./gameAnalysis.js";

// Cache DOM elements
const chessBoard = document.getElementById('board');
const svgContainer = document.getElementById('arrow-container');
const boardSquares = document.getElementsByClassName('square');

// Initialize event listeners and board setup
document.addEventListener('DOMContentLoaded', () => {
    // Initialize arrow functionality
    initArrows(chessBoard, svgContainer);

    // Setup board listeners, squares, and pieces
    addBoardListeners(chessBoard);
    setupBoardSquares(boardSquares);
    setupPieces();
    fillBoardSquaresArray(boardSquares);
    let startingPosition = generateFEN(gameState.boardSquaresArray);
    // getEvaluation(startingPosition,(evaluations) => displayEvaluation(evaluations))
});


chessBoard.addEventListener('click', () => {
    clearArrows(svgContainer);
});
