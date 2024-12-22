import pageLogic from './pagesLogic.js';
import data from './script.js';


function createNewCurve(r, g, b, a, width) {
    return {
        type: "Curve",
        settings: {
            r: r,
            g: g,
            b: b,
            a: a,
            width: width
        },
        points: []
    };
}

function createNewDefaultCurve() {
    return createNewCurve(0,0,0,1,2);
}

function addNewCurve(curves) {
    console.log(curves);
    curves.push(
        createNewDefaultCurve()
    )
}

// adding points to actual Curve
function addPointsToCurve(curve, point) {
    curve.points.push(point);
}


function moveCurveRight(params) {
    // to do
}

function moveCurveLeft(params) {
    // to do
}

function CurveUndo(params) {
    // to do
}

export default {
    createNewCurve,
    addNewCurve,
    addPointsToCurve,
    moveCurveRight,
    moveCurveLeft,
    CurveUndo
};