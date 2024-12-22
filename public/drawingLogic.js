import { createPointsWithDeCastlejau } from "/drawingBezierLogic.js";
import data from './animationData.js';

function drawPoint(x, y, r, g, b, ctx, pointWidth, pointHeight) {
    // to do, dodac kolorki 
    ctx.fillStyle = `rgb(${r}, ${g}, ${b}`;
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

function updateCanvas(array, ctx, canvasWidth, canvasHeight) {
    clearCanvas(ctx, canvasWidth, canvasHeight);
    for (let index = 0; index < array.length; index++) {
        //console.log(array[index]);
        let curve = array[index];
        let settings = curve.settings;
        drawCurve(curve.points, ctx, data.pointsVisibility, settings.r, settings.g, settings.b, settings.a, settings.lineWidth, settings.pointWidth, settings.pointHeight);   
    }
}

export default {
    updateCanvas
}