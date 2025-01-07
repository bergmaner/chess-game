let legalSquares=[];
let isWhiteTurn = true;
const boardSquares = document.getElementsByClassName('square');
const pieces = document.getElementsByClassName('piece');
const piecesImages = document.getElementsByClassName('pieceImg');

setupBoardSquares();
setupPieces();
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
 if((isWhiteTurn && pieceColor === "white") || ( !isWhiteTurn && pieceColor === 'black' ))
 ev.dataTransfer.setData("text", piece.id);
}

function drop(ev){
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    const piece = document.getElementById(data);
    const destinationSquare = ev.currentTarget;
    let destinationSquareId = destinationSquare.id;
    if(isSquareOccupied(destinationSquare) === 'blank'){
        destinationSquare.appendChild(piece)
        isWhiteTurn = !isWhiteTurn
        return;
    }
    if(isSquareOccupied(destinationSquare) !== 'blank'){
       while(destinationSquare.firstChild){
           destinationSquare.removeChild(destinationSquare.firstChild);
       }

       destinationSquare.appendChild(piece);
       isWhiteTurn = !isWhiteTurn;
       return;

    }
}

function isSquareOccupied(square) {
    if(square.querySelector('.piece')){
        const color = square.querySelector('.piece').getAttribute('color');
        return color;
    }
    else{
        return 'blank'
    }

}
































































