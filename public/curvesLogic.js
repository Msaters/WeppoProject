import pageLogic from './pagesLogic.js';
import data from './animationData.js';
import { updateCurveCounter } from './script.js';


function createNewCurve(r, g, b, a, width, pointWidth, pointHeight) {
    return {
        type: "Curve",
        settings: {
            r: r,
            g: g,
            b: b,
            a: a,
            lineWidth: width,
            pointWidth: pointWidth,
            pointHeight: pointHeight
        },
        points: []
    };
}

function createNewDefaultCurve() {
    return createNewCurve(0,0,0,1,3,10,10);
}

function addNewCurve(curves) {
    curves.push(
        createNewDefaultCurve()
    )
    updateCurveCounter();
}

// adding points to actual Curve
function addPointsToCurve(curve, point) {
    curve.points.push(point);
}

function updateActualCurve() {
    data.actualCurve = data.actualPage.curves[data.actualCurveIndex];
    data.actualPage.curveIndex = data.actualCurveIndex;
    updateCurveCounter();
}

function moveCurveRight() {
    if(data.actualCurveIndex === data.actualPage.curves.length - 1) {
        console.log("jestes juz na ostatniej krzywej");
        return;
    }

    data.actualCurveIndex++;
    updateActualCurve();
}

function moveCurveLeft() {
    if(data.actualCurveIndex === 0) {
        console.log("jestes juz na pierwszej krzywej");
        return;
    }

    data.actualCurveIndex--;
    updateActualCurve();
}

function CurveUndo(curve) {
    curve.points.pop();
}

export default {
    createNewCurve,
    addNewCurve,
    addPointsToCurve,
    moveCurveRight,
    moveCurveLeft,
    CurveUndo
};