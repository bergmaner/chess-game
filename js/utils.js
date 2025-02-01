import {gameState} from "./gameSetup.js";
import {calculateCastlingRights} from "./castleLogic.js";

export const getMovesInDirections = (startingSquareId, pieceColor, boardSquaresArray, directions) => {
    const file = startingSquareId.charAt(0);
    const rank = parseInt(startingSquareId.charAt(1));
    const legalSquares = [];

    directions.forEach(([fileStep, rankStep]) => {
        let currentFile = file;
        let currentRank = rank;

        while (true) {
            currentFile = String.fromCharCode(currentFile.charCodeAt(0) + fileStep);
            currentRank += rankStep;

            if (currentFile < 'a' || currentFile > 'h' || currentRank < 1 || currentRank > 8) break;

            const squareId = currentFile + currentRank;
            const square = getPieceAtSquare(squareId, boardSquaresArray);

            if (!square) break;

            const squareContent = square.pieceColor;

            if (squareContent === pieceColor) break;

            legalSquares.push(squareId);

            if (squareContent !== 'blank') break;
        }
    });

    return legalSquares;
};

export const getMovesFromOffsets = (startingSquareId, pieceColor, boardSquaresArray, offsets) => {
    const file = startingSquareId.charAt(0);
    const rank = parseInt(startingSquareId.charAt(1));
    const legalSquares = [];

    offsets.forEach(([fileStep, rankStep]) => {
        const newFile = String.fromCharCode(file.charCodeAt(0) + fileStep);
        const newRank = rank + rankStep;

        if (newFile >= 'a' && newFile <= 'h' && newRank >= 1 && newRank <= 8) {
            const squareId = newFile + newRank;
            const square = getPieceAtSquare(squareId, boardSquaresArray);

            if (!square) return;

            const squareContent = square.pieceColor;

            if (squareContent === 'blank' || squareContent !== pieceColor) {
                legalSquares.push(squareId);
            }
        }
    });

    return legalSquares;
};




export const getPieceAtSquare = (squareId, boardSquaresArray) => {
    if (!Array.isArray(boardSquaresArray)) {
        return null;
    }
    const square = boardSquaresArray?.find((x) => x.squareId === squareId);
    return square || null;
};

export const deepCopyArray = (array) => {
    return JSON.parse(JSON.stringify(array));
};

export const showAlert = ( message ) => {

    const alert = document.querySelector('.popup');
    const header = document.querySelector('.header');
    header.innerHTML = message;
    alert.style.display = 'block';

    // setTimeout(() => {
    //     alert.style.display = 'none';
    // }, 3000);

}

export const highlightPossibleMoves = (legalSquares) => {
    legalSquares.forEach(squareId => {
        const square = document.getElementById(squareId);
        if (square) {
            square.classList.remove('highlight', 'circle');
            if(square.querySelector('.piece')){
                console.log('lalal', square.childNodes)
                square.classList.add('circle');
            }
                else square.classList.add('highlight');


        }
    });
};


export const removeHighlightFromMoves = () => {
    const highlightedSquares = document.querySelectorAll('.highlight, .circle');
    highlightedSquares.forEach(square => {

        square.classList.remove('highlight', 'circle');
    });
};


export const PIECE_MAP = {
    pawn: 'p',
    bishop: 'b',
    knight: 'n',
    rook: 'r',
    king: 'k',
    queen: 'q',
};

export const getPieceNotation = (square) => {
    const piece = PIECE_MAP[square.pieceType] || '';
    return square.pieceColor === 'white' ? piece.toUpperCase() : piece;
};

export const compressEmptySquares = (fen) => {
    return fen.replace(/(blank)+/g, (match) => match.length / 5); // Każde "blank" to 5 znaków
};

export const generateRankFEN = (boardSquares, rank) => {
    return [...'abcdefgh']
        .map((file) => {
            const square = boardSquares.find((x) => x.squareId === `${file}${rank}`);
            return square ? getPieceNotation(square) || 'blank' : 'blank';
        })
        .join('');
};


export const calculateMoveCount = (moves) => Math.floor(moves.length / 2) + 1;

export const getFiftyMovesRuleCount = (moves) => {
    let count = 0;
    for (const move of moves) {
        count++;
        if (move.captured || move.pieceType === 'pawn' || move.promotedTo !== 'blank') {
            count = 0;
        }
    }
    return count;
};

export const generateFEN = (boardSquares) => {
    const generateBoardFEN = () => {
        return Array.from({ length: 8 }, (_, i) => generateRankFEN(boardSquares, 8 - i)).join('/');
    };

    const boardFEN = compressEmptySquares(generateBoardFEN());
    const turnFEN = gameState.isWhiteTurn ? 'w' : 'b';
    const castlingFEN = calculateCastlingRights();
    const enPassantFEN = gameState.enPassantSquare === 'blank' ? '-' : gameState.enPassantSquare;
    const fiftyMovesCount = getFiftyMovesRuleCount(gameState.moves);
    const moveCount = calculateMoveCount(gameState.moves);

    return `${boardFEN} ${turnFEN} ${castlingFEN} ${enPassantFEN} ${fiftyMovesCount} ${moveCount}`;
};


