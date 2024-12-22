import { createPointsWithDeCastlejau } from "/drawingBezierLogic.js";

function drawPoint(x, y, r, g, b, ctx) {
    // to do, dodac kolorki 
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(x, y, 10, 10);
}

function drawCurve(arr, ctx, doIDrawPoints) {
    if(arr.length === 0) 
        return;

    // dodaj punkty
    if(doIDrawPoints)
        for(let i = 0; i < arr.length; i++) {
            drawPoint(arr[i].xcord, arr[i].ycord, 0, 26, 0, ctx);
        }

    //dodaj linie
    let curvePoints = createPointsWithDeCastlejau(1000, arr);
    ctx.moveTo(Math.floor(curvePoints[0].xcord), Math.floor(curvePoints[0].ycord));
    ctx.beginPath();

    for(let i = 0; i < curvePoints.length; i++)
    {
        ctx.lineTo(Math.floor(curvePoints[i].xcord), Math.floor(curvePoints[i].ycord));
    }

    ctx.strokeStyle = 'black';    // Ustaw kolor linii
    ctx.lineWidth = 2;            // Ustaw grubość linii
    ctx.stroke();
}

function clearCanvas(ctx, canvasWidth, canvasHeight){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function updateCanvas(array, ctx, canvasWidth, canvasHeight) {
    clearCanvas(ctx, canvasWidth, canvasHeight);
    for (let index = 0; index < array.length; index++) {
        drawCurve(array[index].points, ctx, true);   
    }
}

export default {
    updateCanvas
}