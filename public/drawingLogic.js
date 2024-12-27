import { createPointsWithDeCastlejau } from "/drawingBezierLogic.js";
import data from './animationData.js';

function drawPoint(centerX, centerY, r, g, b, ctx, pointWidth, pointHeight) {
    // to do, dodac kolorki 
    ctx.fillStyle = `rgb(${r}, ${g}, ${b}`;
    const x = centerX - pointWidth / 2; 
    const y = centerY - pointHeight / 2; 
    ctx.fillRect(x, y, pointWidth, pointHeight);
}

function drawCurve(arr, ctx, doIDrawPoints, r, g, b, a, lineWidth, pointWidth, pointHeight, isActive) {
    if(arr.length === 0) 
        return;

    //highlight rgb if isActive
    const increase = 50;
    if(isActive) {
        r = Math.min(255, r + increase);
        g = Math.min(255, g + increase);
        b = Math.min(255, b + increase);
        a = Math.min(1, a + 0.1);
    }

    // dodaj punkty
    if(doIDrawPoints)
        for(let i = 0; i < arr.length; i++) {
            if(isActive)
                drawPoint(arr[i].xcord, arr[i].ycord, 0 + increase, 26 + increase, 0 + increase, ctx, pointWidth, pointHeight);
            else
                drawPoint(arr[i].xcord, arr[i].ycord, 0, 26, 0, ctx, pointWidth, pointHeight);
        }

    //dodaj linie
    let curvePoints = createPointsWithDeCastlejau(1000, arr);
    ctx.moveTo(curvePoints[0].xcord, curvePoints[0].ycord);
    ctx.beginPath();

    for(let i = 0; i < curvePoints.length; i++)
    {
        ctx.lineTo(curvePoints[i].xcord, curvePoints[i].ycord);
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
        if(index === data.actualCurveIndex && data.isActiveHighlighted)
            drawCurve(curve.points, ctx, data.pointsVisibility, settings.r, settings.g, settings.b, settings.a, settings.lineWidth, settings.pointWidth, settings.pointHeight, true);   
        else
            drawCurve(curve.points, ctx, data.pointsVisibility, settings.r, settings.g, settings.b, settings.a, settings.lineWidth, settings.pointWidth, settings.pointHeight, false);   
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