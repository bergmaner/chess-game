import {gameState} from "./gameSetup.js";

export const initArrows = (boardElement, arrowContainer) => {
    let rightClickDown = false;
    let startSquare = null;

    boardElement.addEventListener("mousedown", (event) => {
        if (event.button === 2) {
            rightClickDown = true;
            startSquare = event.target.closest(".square");
        }
    });

    boardElement.addEventListener("mouseup", (event) => {
        if (event.button === 2) {
            rightClickDown = false;
            const endSquare = event.target.closest(".square");

            if (!startSquare || !endSquare || startSquare === endSquare) return;

            const arrowId = `${startSquare.id}-${endSquare.id}`;
            if (gameState.activeArrows.has(arrowId)) {
                removeArrow(arrowId, arrowContainer);
            } else {
                drawArrow(startSquare, endSquare, arrowId, arrowContainer);
            }
        }
    });

    boardElement.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
};

export const drawArrow = (startSquare, endSquare, arrowId, svgContainer) => {
    const startRect = startSquare.getBoundingClientRect();
    const endRect = endSquare.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI); // Kąt w stopniach
    const headLength = 15;
    if (!svgContainer.querySelector("svg")) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "arrows");
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.pointerEvents = "none";
        svgContainer.appendChild(svg);
    }

    const svg = svgContainer.querySelector("svg");

    if (gameState.activeArrows.has(arrowId)) {
        removeArrow(arrowId,svgContainer);
        return;
    }


    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", startX);
    line.setAttribute("y1", startY);


    const adjustedEndX = endX - (headLength * Math.cos(angle * (Math.PI / 180)));
    const adjustedEndY = endY - (headLength * Math.sin(angle * (Math.PI / 180)));
    line.setAttribute("x2", adjustedEndX);
    line.setAttribute("y2", adjustedEndY);

    line.setAttribute(
        "style",
        "stroke: rgba(255, 170, 0, 0.8); stroke-width: 6; pointer-events: none;"
    );


    const arrowHead = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    arrowHead.setAttribute("points", `0,0 -15,-8 -15,8`);
    arrowHead.setAttribute(
        "style",
        "fill: rgba(255, 170, 0, 0.8); pointer-events: none;"
    );
    arrowHead.setAttribute("transform", `translate(${endX}, ${endY}) rotate(${angle})`);


    svg.appendChild(line);
    svg.appendChild(arrowHead);


    gameState.activeArrows.set(arrowId, { line, arrowHead });
};

export const removeArrow = (arrowId, svgContainer) => {
    const svg = svgContainer.querySelector("svg");
    if (!svg) return;
    const arrowData = gameState.activeArrows.get(arrowId);
    if (arrowData) {
        if (arrowData.line) svg.removeChild(arrowData.line);
        if (arrowData.arrowHead) svg.removeChild(arrowData.arrowHead);
        if (arrowData.hitbox) svg.removeChild(arrowData.hitbox);
        gameState.activeArrows.delete(arrowId);
    }
};

export const clearArrows = (svgContainer) => {
    const svg = svgContainer.querySelector("svg");
    if (!svg) {
        console.log("SVG container not found.");
        return;
    }

    gameState.activeArrows.forEach((arrowData, arrowId) => {
        if (arrowData.line) {
            svg.removeChild(arrowData.line);
            console.log(`Removed line for arrow: ${arrowId}`);
        }
        if (arrowData.arrowHead) {
            svg.removeChild(arrowData.arrowHead);
            console.log(`Removed arrow head for arrow: ${arrowId}`);
        }
    });

    gameState.activeArrows.clear();
    console.log("All arrows cleared.");
};