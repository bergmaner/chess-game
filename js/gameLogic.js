import {
    checkPawnDiagonalCaptures,
    getBishopMoves, getKingMoves,
    getKnightMoves,
    getRookMoves
} from "./pieceMoves.js";
import {deepCopyArray, getPieceAtSquare, showAlert} from "./utils.js";
import {gameState, toggleTurn} from "./gameSetup.js";
import {getAllPossibleMoves, updateBoardSquaresArray} from "./moveLogic.js";
import {getKingLastMove, makeMove} from "./gameHistory.js";
import {drag} from "./dragAndDrop.js";

const boardSquares = document.getElementsByClassName('square');
const chessBoard = document.getElementById('board');
export const isKingInCheck = (squareId, pieceColor, boardSquaresArray) => {

    const checkRules = [
        {
            moves: getRookMoves,
            types: ['rook', 'queen'],
        },
        {
            moves: getBishopMoves,
            types: ['bishop', 'queen'],
        },
        {
            moves: checkPawnDiagonalCaptures,
            types: ['pawn'],
        },
        {
            moves: getKnightMoves,
            types: ['knight'],
        },
        {
            moves: getKingMoves,
            types: ['king'],
        },
    ];

    for (const rule of checkRules) {

        const legalSquares = rule.moves(squareId, pieceColor, boardSquaresArray);


        for (const squareId of legalSquares) {
            const pieceProperties = getPieceAtSquare(squareId, boardSquaresArray);


            if (rule.types.includes(pieceProperties.pieceType) && pieceColor !== pieceProperties.pieceColor) {
                return true;
            }
        }
    }

    return false;
};

export const checkMoveValidAgainstCheck = (legalSquares, startingSquareId, pieceColor, pieceType) => {

    const kingSquare = gameState.isWhiteTurn
        ? getKingLastMove('white')
        : getKingLastMove('black');


    return legalSquares.filter((destinationId) => isMoveValidAgainstCheck(
        startingSquareId,
        destinationId,
        pieceColor,
        pieceType,
        kingSquare
    ));
};


const isMoveValidAgainstCheck = (startingSquareId, destinationId, pieceColor, pieceType, kingSquare) => {
    const boardSquaresArrayCopy = deepCopyArray(gameState.boardSquaresArray);
    const updatedBoard = updateBoardSquaresArray(startingSquareId, destinationId, boardSquaresArrayCopy);


    if (pieceType === 'king') {
        return !isKingInCheck(destinationId, pieceColor, updatedBoard);
    }

    return !isKingInCheck(kingSquare, pieceColor, updatedBoard);
};

export const checkForCheckmate = () => {

    let kingSquare = gameState.isWhiteTurn ? getKingLastMove('white') : getKingLastMove('black');
    let pieceColor = gameState.isWhiteTurn ? 'white' : 'black';
    let boardSquaresArrayCopy = deepCopyArray(gameState.boardSquaresArray)
    let kingIsCheck = isKingInCheck(kingSquare, pieceColor, boardSquaresArrayCopy);
    if(!kingIsCheck) return;
    let possibleMoves = getAllPossibleMoves(boardSquaresArrayCopy, pieceColor);
    if(possibleMoves.length > 0) return;

    let message = '';
    gameState.isWhiteTurn ? (message = 'Black Wins') : (message = 'White Wins' );
    showAlert(message);

}

export const displayPromotionChoices = (pieceId, pieceColor, startingSquareId, destinationSquareId, captured) => {
    const file = destinationSquareId[0];
    const rank = parseInt(destinationSquareId[1]);
    const direction = pieceColor === 'white' ? -1 : 1;

    const squareBehindIds = Array.from({ length: 3 }, (_, i) => file + (rank + direction * (i + 1)));

    const destinationSquare = document.getElementById(destinationSquareId);
    const squareBehindElements = squareBehindIds.map(id => document.getElementById(id));

    const promotionPieces = ['queen', 'knight', 'rook', 'bishop'];

    const promotionElements = promotionPieces.map((pieceType, index) =>
        createChessPiece(pieceType, pieceColor, 'promotionOption')
    );

    destinationSquare.appendChild(promotionElements[0]);
    promotionElements.slice(1).forEach((piece, index) => {
        squareBehindElements[index]?.appendChild(piece);
    });

    let promotionOptions = document.getElementsByClassName('promotionOption');

    for (let i=0; i<promotionOptions.length ;i++ ){

        let pieceType = promotionOptions[i].classList[1];
        promotionOptions[i].addEventListener('click', () => {
            performPromotion(pieceId, pieceType, pieceColor, startingSquareId, destinationSquareId,captured);

        })

    }



};

export const createChessPiece = ( pieceType, color, pieceClass ) => {

    let pieceName = 'images/' + color.charAt(0).toUpperCase() + color.slice(1) + '-' + pieceType.charAt(0).toUpperCase() + pieceType.slice(1) + '.png';



    let pieceDiv = document.createElement('div');
    pieceDiv.className = `${pieceClass} ${pieceType}`;
    pieceDiv.setAttribute('color', color);
    let img = document.createElement('img');
    img.src = pieceName;
    img.alt = pieceType;
    pieceDiv.appendChild(img);
    return pieceDiv;

}

export const clearPromotionOptions = () => {

    for (let i=0; i<boardSquares.length; i++){
        let style = getComputedStyle(boardSquares[i]);
        let backgroundColor = style.backgroundColor;
        let rgbaColor = backgroundColor.replace('0.5)','1)');
        boardSquares[i].style.backgroundColor = rgbaColor;
        boardSquares[i].style.opacity = 1;

    }

    let elementsToRemove = chessBoard.querySelectorAll('.promotionOption');
    elementsToRemove.forEach((element) => {
        element.parentElement.removeChild(element);
    });
    gameState.allowMovement = true;

}

export const updateBoardSquaresOpacity = () => {

    for( let i=0; i<boardSquares.length; i++ ){
        if(!(boardSquares[i].querySelector('.promotionOption'))){
            boardSquares[i].style.opacity = 0.5;
        }
        else{

            let style = getComputedStyle(boardSquares[i]);
            let backgroundColor = style.backgroundColor;
            let rgbaColor = backgroundColor.replace('rgb', 'rgba').replace(')',',0.5)');
            boardSquares[i].style.backgroundColor = rgbaColor;

        }


    }

}

export const performPromotion = (pieceId, pieceType, pieceColor,startingSquareId,destinationSquareId, captured) => {

    clearPromotionOptions();
    let piece = createChessPiece(pieceType, pieceColor,'piece');

    piece.addEventListener('dragstart', drag);
    piece.setAttribute('draggable', true);
    piece.firstChild.setAttribute('draggable',false);
    piece.id = pieceType + pieceId;




    const startingSquare = document.getElementById(startingSquareId);
    while(startingSquare.firstChild){
        startingSquare.removeChild(startingSquare.firstChild);
    }

    const destinationSquare = document.getElementById(destinationSquareId);

    if(captured)
    while(destinationSquare.firstChild){
        destinationSquare.removeChild(destinationSquare.firstChild);
    }
    destinationSquare.appendChild(piece);
    toggleTurn();
    gameState.boardSquaresArray = updateBoardSquaresArray(startingSquareId,destinationSquareId,gameState.boardSquaresArray,pieceType);
    makeMove(startingSquareId, destinationSquareId, pieceType, pieceColor, captured,pieceType);
    checkForCheckmate();
    return;

}



