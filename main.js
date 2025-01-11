let boardSquaresArray=[];
let isWhiteTurn = true;
const boardSquares = document.getElementsByClassName('square');
const pieces = document.getElementsByClassName('piece');
const piecesImages = document.getElementsByClassName('pieceImg');

setupBoardSquares();
setupPieces();
fillBoardSquaresArray();
function setupBoardSquares()  {
    for (let i=0; i<boardSquares.length; i++){
        boardSquares[i].addEventListener('dragover',allowDrop);
        boardSquares[i].addEventListener('drop',drop);
        let row= 8 - Math.floor(i/8);
        let column = String.fromCharCode(97 + (i%8));
        let square = boardSquares[i];
        square.id = column + row;

    }
}


function  fillBoardSquaresArray(){
    const boardSquares = document.getElementsByClassName('square');
    for (let i =0; i< boardSquares.length; i++){
        let row = 8 - Math.floor(i/8);
        let column = String.fromCharCode(97 + (i%8));
        let square = boardSquares[i];
        square.id = column + row;
        let color = '';
        let pieceType = '';
        let pieceId = '';
        if(square.querySelector('.piece')){
            color = square.querySelector('.piece').getAttribute("color");
            pieceType = square.querySelector('.piece').classList[1];
            pieceId = square.querySelector('.piece').id;
        }
        else{
            color='blank';
            pieceType='blank';
            pieceId='blank'
        }

        let arrayElement={
            squareId:square.id,
            pieceColor: color,
            pieceType: pieceType,
            pieceId: pieceId
        }
        boardSquaresArray.push(arrayElement);
    }
}

function setupPieces()  {

    for(let i=0; i<pieces.length; i++){
        pieces[i].addEventListener('dragstart', drag);
        pieces[i].setAttribute('draggable', true);
        pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
    }

    for(let i=0; i<piecesImages.length; i++){
        piecesImages[i].setAttribute('draggable', false);
    }

}

function allowDrop(ev){
    ev.preventDefault()
}

function drag(ev){
 const piece = ev.target;
 const pieceColor = piece.getAttribute('color');
 const pieceType = piece.classList[1];
 const pieceId = piece.id;
 if((isWhiteTurn && pieceColor === "white") || ( !isWhiteTurn && pieceColor === 'black' )){
     const startingSquareId = piece.parentNode.id;
     ev.dataTransfer.setData("text", piece.id + ' ' + startingSquareId);
     const pieceObject = { pieceColor: pieceColor, pieceType:pieceType,pieceId:pieceId }

     let legalSquares = getPossibleMoves(startingSquareId, pieceObject, boardSquaresArray);
     let legalSquaresJson = JSON.stringify(legalSquares);
     ev.dataTransfer.setData("application/json", legalSquaresJson);
 }

}

function drop(ev){
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
    let squareContent = getPieceAtSquare(destinationSquareId, boardSquaresArray);
    if((squareContent.pieceColor === 'blank') && (legalSquares.includes(destinationSquareId))){
        destinationSquare.appendChild(piece)
        isWhiteTurn = !isWhiteTurn
        updateBoardSquaresArray(startingSquareId, destinationSquareId, boardSquaresArray);
        return;
    }
    if(squareContent.pieceColor !== 'blank' && (legalSquares.includes(destinationSquareId)) ){
       while(destinationSquare.firstChild){
           destinationSquare.removeChild(destinationSquare.firstChild);
       }

       destinationSquare.appendChild(piece);
       isWhiteTurn = !isWhiteTurn;
       updateBoardSquaresArray(startingSquareId, destinationSquareId, boardSquaresArray);
       return;

    }
}

function updateBoardSquaresArray (currentSquareId, destinationSquareId, boardSquaresArray){

    let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId);
    let destinationElement = boardSquaresArray.find((x) => x.squareId === destinationSquareId);
    let pieceColor = currentSquare.pieceColor;
    let pieceType = currentSquare.pieceType;
    let pieceId = currentSquare.pieceId;
    destinationElement.pieceColor = pieceColor;
    destinationElement.pieceType = pieceType;
    destinationElement.pieceId = pieceId;
    currentSquare.pieceColor = 'blank';
    currentSquare.pieceType = 'blank';
    currentSquare.pieceId = 'blank';


}

function getPossibleMoves(startingSquareId, piece, boardSquaresArray){
    const pieceColor = piece.pieceColor;
    const pieceType = piece.pieceType;
    let legalSquares = [];

    if(pieceType === 'pawn'){
        legalSquares = getPawnMoves(startingSquareId, pieceColor, boardSquaresArray);
        return legalSquares;
    }
    else if(pieceType === 'knight'){
        legalSquares = getKnightMoves(startingSquareId, pieceColor, boardSquaresArray);
        return legalSquares;
    }
    else if(pieceType === 'rook'){
        legalSquares = getRookMoves(startingSquareId, pieceColor, boardSquaresArray);
        return legalSquares;
    }
    else if(pieceType === 'bishop'){
        legalSquares = getBishopMoves(startingSquareId, pieceColor,boardSquaresArray);
        return legalSquares;
    }

    else if(pieceType ==='queen'){
        legalSquares = getQueenMoves(startingSquareId, pieceColor, boardSquaresArray);
        return legalSquares;
    }
    else if(pieceType === 'king'){
        legalSquares = getKingMoves(startingSquareId, pieceColor, boardSquaresArray);
        return legalSquares;
    }

}

function getPawnMoves(startingSquareId, pieceColor, boardSquaresArray){

    return[
        ...checkPawnDiagonalCaptures(startingSquareId, pieceColor, boardSquaresArray),
        ...checkPawnForwardMoves(startingSquareId, pieceColor, boardSquaresArray)
    ];
}

function getKnightMoves(startingSquareId, pieceColor, boardSquaresArray){
    const file = startingSquareId.charCodeAt(0) -97;
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    const legalSquares = [];

    let currentFile = file;
    let currentRank = rankNumber;

    const moves = [
        [-2,1], [-1,2], [1,2], [2,1], [2,-1], [1,-2], [-1,-2],[-2,-1]    ];

    moves.forEach((move) =>{
        currentFile = file+ move[0];
        currentRank = rankNumber + move[1];

        if(currentFile >= 0 && currentFile <= 7 && currentRank >0 && currentRank <= 8){
            let currentSquareId = String.fromCharCode(currentFile + 97) + currentRank;
            let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId)
            let squareContent = currentSquare.pieceColor;
            if(squareContent !== 'blank' && squareContent === pieceColor) return legalSquares;
            legalSquares.push(String.fromCharCode(currentFile + 97) + currentRank)
        }
    })

    return legalSquares;

}


function getRookMoves(startingSquareId, pieceColor, boardSquaresArray){

    return [
        ...moveToEightRank(startingSquareId,pieceColor,boardSquaresArray),
        ...moveToFirstRank(startingSquareId,pieceColor,boardSquaresArray),
        ...moveToAFile(startingSquareId,pieceColor,boardSquaresArray),
        ...moveToHFile(startingSquareId,pieceColor,boardSquaresArray)
    ];
}

function getBishopMoves(startingSquareId, pieceColor, boardSquaresArray){

    return [
        ...moveToEightRankHFile(startingSquareId,pieceColor,boardSquaresArray),
        ...moveToEightRankAFile(startingSquareId,pieceColor,boardSquaresArray),
        ...moveToFirstRankHFile(startingSquareId,pieceColor,boardSquaresArray),
        ...moveToFirstRankAFile(startingSquareId,pieceColor,boardSquaresArray)
    ];
}

function getQueenMoves(startingSquareId, pieceColor,boardSquaresArray){

    return [
        ...getBishopMoves(startingSquareId, pieceColor,boardSquaresArray),
        ...getRookMoves(startingSquareId, pieceColor,boardSquaresArray)
    ]

}


function getKingMoves(startingSquareId, pieceColor,boardSquaresArray){
    const file = startingSquareId.charCodeAt(0) -97;
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let legalSquares = [];
    let currentFile = file;
    let currentRank = rankNumber;

    const moves = [
        [0,1], [0,-1], [1,1], [1,-1], [-1,0], [-1,-1], [-1,1],[1,0]    ];

    moves.forEach((move) =>{
        currentFile = file+ move[0];
        currentRank = rankNumber + move[1];

        if(currentFile >= 0 && currentFile <= 7 && currentRank >0 && currentRank <= 8){
            let currentSquareId = String.fromCharCode(currentFile + 97) + currentRank;
            let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId);
            let squareContent = currentSquare.pieceColor;
            if(squareContent !== 'blank' && squareContent === pieceColor) return legalSquares;
            legalSquares.push(String.fromCharCode(currentFile + 97) + currentRank)
        }
    })

    return legalSquares;

}


function moveToEightRankAFile(startingSquareId, pieceColor, boardSquaresArray){
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let legalSquares = [];
    let currentFile = file;
    let currentRank = rankNumber;

    while(!(currentFile === 'a' || currentRank === 8)){
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.length -1) -1);
        currentRank++;
        let currentSquareId = currentFile + currentRank;
        let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId);
        let squareContent = currentSquare.pieceColor;
        if(squareContent !== 'blank' && squareContent === pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)
        if(squareContent !== 'blank' && squareContent !== pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)
    }

    return legalSquares;
}
function moveToEightRankHFile(startingSquareId, pieceColor, boardSquaresArray){
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let legalSquares = [];
    let currentFile = file;
    let currentRank = rankNumber;

    while(!(currentFile === 'h' || currentRank === 8)){
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.length -1) +1);
        currentRank++;
        let currentSquareId = currentFile + currentRank;
        let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId);
        let squareContent = currentSquare.pieceColor;
        if(squareContent !== 'blank' && squareContent === pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)
        if(squareContent !== 'blank' && squareContent !== pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)
    }

    return legalSquares;
}

function moveToFirstRankAFile(startingSquareId, pieceColor, boardSquaresArray){
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let legalSquares = [];
    let currentFile = file;
    let currentRank = rankNumber;

    while(!(currentFile === 'a' || currentRank === 1)){
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.length -1) -1);
        currentRank--;
        let currentSquareId = currentFile + currentRank;
        let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId);
        let squareContent = currentSquare.pieceColor;
        if(squareContent !== 'blank' && squareContent === pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)
        if(squareContent !== 'blank' && squareContent !== pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)

    }

    return legalSquares;

}

function moveToFirstRankHFile(startingSquareId, pieceColor,boardSquaresArray){
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let legalSquares = [];
    let currentFile = file;
    let currentRank = rankNumber;

    while(!(currentFile === 'h' || currentRank === 1)){
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.length -1) +1);
        currentRank--;
        let currentSquareId = currentFile + currentRank;
        let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId);
        let squareContent = currentSquare.pieceColor;
        if(squareContent !== 'blank' && squareContent === pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)
        if(squareContent !== 'blank' && squareContent !== pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)

    }

    return legalSquares;

}



function moveToEightRank(startingSquareId, pieceColor,boardSquaresArray){
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let legalSquares = [];
    let currentRank = rankNumber;

    while(currentRank !== 8){
        currentRank ++ ;
        let currentSquareId = file + currentRank;
        let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId);
        let squareContent = currentSquare.pieceColor;
        if(squareContent !== 'blank' && squareContent === pieceColor) return legalSquares;

        legalSquares.push(currentSquareId)

        if(squareContent !== 'blank' && squareContent !== pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)

    }
    return legalSquares;

}

function moveToFirstRank(startingSquareId, pieceColor, boardSquaresArray){
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    let legalSquares = [];
    let currentRank = rankNumber;

    while(currentRank !== 1){
        currentRank -- ;
        let currentSquareId = file + currentRank;
        let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId);
        let squareContent = currentSquare.pieceColor;
        if(squareContent !== 'blank' && squareContent === pieceColor) return legalSquares;

        legalSquares.push(currentSquareId)

        if(squareContent !== 'blank' && squareContent !== pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)

    }
    return legalSquares;

}
function moveToAFile(startingSquareId, pieceColor, boardSquaresArray){
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    let legalSquares = [];
    let currentFile = file;

    while(currentFile !== 'a'){
       currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.length -1) -1 )
        let currentSquareId = currentFile + rank;
        let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId);
        let squareContent = currentSquare.pieceColor;
        if(squareContent !== 'blank' && squareContent === pieceColor) return legalSquares;

        legalSquares.push(currentSquareId)

        if(squareContent !== 'blank' && squareContent !== pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)

    }
    return legalSquares;

}

function moveToHFile(startingSquareId, pieceColor, boardSquaresArray){
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    let legalSquares = [];
    let currentFile = file;

    while(currentFile !== 'h'){
        currentFile = String.fromCharCode(currentFile.charCodeAt(currentFile.length -1) +1 )
        let currentSquareId = currentFile + rank;
        let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId);
        let squareContent = currentSquare.pieceColor;
        if(squareContent !== 'blank' && squareContent === pieceColor) return legalSquares;

        legalSquares.push(currentSquareId)

        if(squareContent !== 'blank' && squareContent !== pieceColor) return legalSquares;
        legalSquares.push(currentSquareId)

    }
    return legalSquares;

}



function checkPawnDiagonalCaptures(startingSquareId, pieceColor, boardSquaresArray){

    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);

    let currentFile = file;
    let currentRank = rankNumber;
    let currentSquareId = currentRank + currentFile;
    let legalSquares = [];
    const direction = pieceColor === 'white' ? 1 : -1;

    currentRank += direction;

    for (let i=-1; i<= 1; i+=2){
        currentFile = String.fromCharCode(file.charCodeAt(0) + i);
        if(currentFile >= 'a' && currentFile <= 'h'){
            currentSquareId = currentFile + currentRank;
            let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId)

            console.log('ddd', boardSquaresArray)

            const squareContent = currentSquare.pieceColor;
            if(squareContent !== 'blank' && squareContent !== pieceColor)
                legalSquares.push(currentSquareId)
        }
    }
return legalSquares

}

function checkPawnForwardMoves(
    startingSquareId,
    pieceColor,
    boardSquaresArray
) {
    const file = startingSquareId.charAt(0);
    const rank = startingSquareId.charAt(1);
    const rankNumber = parseInt(rank);

    let legalSquares = [];
    let currentFile = file;
    let currentRank = rankNumber;
    let currentSquareId = currentRank + currentFile;

    const direction = pieceColor === 'white' ? 1 : -1;
    currentRank += direction;

    currentSquareId = currentFile + currentRank;
    let currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId)
    let squareContent = currentSquare.pieceColor;
    if(squareContent !== 'blank') return legalSquares;
    legalSquares.push(currentSquareId)

    if(rankNumber !== 2 && rankNumber !== 7) return legalSquares;
    currentRank += direction;
    currentSquareId = currentFile + currentRank;
    currentSquare = boardSquaresArray.find((x) => x.squareId === currentSquareId)
    squareContent = currentSquare.pieceColor;
    if(squareContent !== 'blank')
        return legalSquares;
    legalSquares.push(currentSquareId)

    return legalSquares;
}


function getPieceAtSquare(squareId, boardSquaresArray) {
    let currentSquare = boardSquaresArray.find((x) => x.squareId === squareId);
    const color = currentSquare.pieceColor;
    const pieceType = currentSquare.pieceType;
    const pieceId = currentSquare.pieceId;
    return { pieceColor: color, pieceType: pieceType, pieceId: pieceId }

}
