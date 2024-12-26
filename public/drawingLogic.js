import { createPointsWithDeCastlejau } from "/drawingBezierLogic.js";
import data from './animationData.js';

function drawPoint(centerX, centerY, r, g, b, ctx, pointWidth, pointHeight) {
    // to do, dodac kolorki 
    ctx.fillStyle = `rgb(${r}, ${g}, ${b}`;
    const x = centerX - pointWidth / 2; 
    const y = centerY - pointHeight / 2; 
    ctx.fillRect(x, y, pointWidth, pointHeight);
}

function drawCurve(arr, ctx, doIDrawPoints, r, g, b, a, lineWidth, pointWidth, pointHeight) {
    if(arr.length === 0) 
        return;

    // dodaj punkty
    if(doIDrawPoints)
        for(let i = 0; i < arr.length; i++) {
            drawPoint(arr[i].xcord, arr[i].ycord, 0, 26, 0, ctx, pointWidth, pointHeight);
        }

    //dodaj linie
    let curvePoints = createPointsWithDeCastlejau(1000, arr);
    ctx.moveTo(Math.floor(curvePoints[0].xcord), Math.floor(curvePoints[0].ycord));
    ctx.beginPath();

    for(let i = 0; i < curvePoints.length; i++)
    {
        ctx.lineTo(Math.floor(curvePoints[i].xcord), Math.floor(curvePoints[i].ycord));
    }

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;    
    ctx.lineWidth = lineWidth;            
    ctx.stroke();
}

function clearCanvas(ctx, canvasWidth, canvasHeight){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function updateCanvas(curves, ctx, canvasWidth, canvasHeight) {
    clearCanvas(ctx, canvasWidth, canvasHeight);
    for (let index = 0; index < curves.length; index++) {
        let curve = curves[index];
        let settings = curve.settings;
        drawCurve(curve.points, ctx, data.pointsVisibility, settings.r, settings.g, settings.b, settings.a, settings.lineWidth, settings.pointWidth, settings.pointHeight);   
    }
}

let uiElementsDisplayValues;
function showNextAnimation(pages, ctx, canvasWidth, canvasHeight, delay) {
    setTimeout(() => {
        if (pages.length === 0) {
            //finished make ui visible
            const uiElements = document.getElementsByClassName("visible");
            for (let index = 0; index < uiElements.length; index++) {
                const element = uiElements[index];
                element.style.display = uiElementsDisplayValues[index];
            }
        } else {
            updateCanvas(pages[0].curves, ctx, canvasWidth, canvasHeight);
            pages.shift();
            showNextAnimation(pages, ctx, canvasWidth, canvasHeight, delay);
        }
    }, delay);
}

function showAnimation(animation, ctx, canvasWidth, canvasHeight, delay) {
    // firstly make ui not visible
    uiElementsDisplayValues = []; // save display values for later
    const uiElements = document.getElementsByClassName("visible");
    for (let index = 0; index < uiElements.length; index++) {
        const element = uiElements[index];
        const computedStyleDisplay = window.getComputedStyle(element).display;
        uiElementsDisplayValues.push(computedStyleDisplay);
        element.style.display = "none";
    }

    const pages = JSON.parse(JSON.stringify(animation.pages));
    updateCanvas(pages[0].curves, ctx, canvasWidth, canvasHeight);
    pages.shift();
    showNextAnimation(pages, ctx, canvasWidth, canvasHeight, delay);
}

export default {
    updateCanvas,
    showAnimation
}