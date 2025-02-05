import {gameState} from "./gameSetup.js";

   

export const getEvaluation = (fen, callback) => {
    const engine = new Worker('js/stockfish.js');
    let evaluations = [];
    console.log("Current FEN:", fen);

    engine.onerror = (error) => {
        console.error("Worker error:", error);
    };

    engine.onmessage = function (event) {
        let message = event.data;
        console.log("Message from Worker:", message);

        if (message.startsWith("info depth 10")) {
            let multipvIndex = message.indexOf("multipv");
            console.log('mmmm', multipvIndex)
            if (multipvIndex !== -1) {
                let multipvString = message.slice(multipvIndex).split(" ")[1];
                let multipv = parseInt(multipvString);
                let scoreIndex = message.indexOf("score cp");

                if (scoreIndex !== -1) {
                    let scoreString = message.slice(scoreIndex).split(" ")[2];
                    let evaluation = parseInt(scoreString) / 100;
                    evaluation = gameState.isWhiteTurn ? evaluation : evaluation * -1;
                    evaluations[multipv - 1] = evaluation;
                } else {
                    scoreIndex = message.indexOf("score mate");
                    let scoreString = message.slice(scoreIndex).split(" ")[2];
                    let evaluation = parseInt(scoreString);
                    evaluation = Math.abs(evaluation);
                    evaluations[multipv - 1] = "#" + evaluation;
                }

                let pvIndex = message.indexOf(" pv ");

                console.log('dddd', pvIndex)

                if (pvIndex !== -1) {
                    let pvString = message.slice(pvIndex + 4).split(" ");
                    console.log("Evaluation added:", evaluations);
                    callback(evaluations); // Wywołaj callback
                }
            }
        }
    };

console.log('nnnnnn');

engine.postMessage("uci");
engine.postMessage("isready");
engine.postMessage("ucinewgame");
engine.postMessage("setoption name multipv value 3");
engine.postMessage("position fen " + fen);
engine.postMessage("go depth 10");

setTimeout(() => {
    console.log("Terminating Worker...");
    engine.terminate();
}, 5000); 

};
export const displayEvaluation = ( evaluations ) => {

console.log('lalalalalla')


    let blackBar = document.querySelector('.blackBar');
    let blackBarHeight = 50 - (evaluations[0]/15) * 100;
    blackBarHeight = blackBarHeight > 100 ? 100  : blackBarHeight;
    blackBarHeight = blackBarHeight < 0 ? 0  : blackBarHeight;

    console.log('lllll', blackBarHeight)

    blackBar.style.height = blackBarHeight + '%';
    let evalNum = document.querySelector('.evalNum');
    evalNum.innerHTML = evaluations[0];
}
