import pageLogic from './pagesLogic.js';
import data from './animationData.js';
import { updateCurveCounter, canvasWidth, canvasHeight } from './script.js';
import { createPointsWithDeCastlejau } from "/drawingBezierLogic.js";


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

function curveCopy(indexFrom, indexTo) {
    data.actualPage.curves[indexTo] = JSON.parse(JSON.stringify(data.actualPage.curves[indexFrom]));
    data.actualCurve = data.actualPage.curves[data.actualCurveIndex];
}

function CurveUndo(curve) {
    curve.points.pop();
}

function getAllPointsFromActualPage() {
    let allPoints = [];
    for (const curve of data.actualPage.curves) {
        for (const point of curve.points) {
            allPoints.push(point);
        }
    }
    return allPoints;
}

function getAllCurvesFromActualPage() {
    let allCurves = [];
    for (const curve of data.actualPage.curves) {
        allCurves.push(curve);
    }
    return allCurves;
}

function updateCurveSettings(curve, R, G, B, A, LineWidth, PointWidth, PointHeight) {
    let settings = curve.settings;
    if(PointWidth !== "" && PointHeight !== "") {
        settings.pointWidth = PointWidth;
        settings.pointHeight = PointHeight;
    }

    settings.r = R;
    settings.g = G;
    settings.b = B;
    settings.a = A;
    settings.lineWidth = LineWidth;
    console.log(LineWidth, settings.lineWidth);
    
}

function getAllPointsFromCurves(curves) {
    let allPoints = [];
    for (const curve of curves) {
        for (const point of curve.points) {
            allPoints.push(point);
        }
    }
    return allPoints;
}

// draging logic
function isCurveClicked(bezierPoints, startingX, startingY, reachingWidth, reachingHeight) {
    
    for (const bezierPoint of bezierPoints) {
        if(Math.abs(bezierPoint.xcord - startingX) <= reachingWidth && Math.abs(bezierPoint.ycord - startingY) <= reachingHeight) {
            return true;
        }
    }

    return false;
}

function movePoints(points, moveX, moveY) {
    for (const point of points) {
        point.xcord += moveX;
        point.ycord += moveY;
    }
}

function movePointToClosePoint(point) {
    let pointsFromPage = getAllPointsFromActualPage();
    for (const pointFromPage of pointsFromPage) {
        if(Math.abs(point.xcord - pointFromPage.xcord) <= data.reachClosestPointLength && Math.abs(point.ycord - pointFromPage.ycord) <= data.reachClosestPointLength) {
            console.log("found point");
            point.xcord = pointFromPage.xcord;
            point.ycord = pointFromPage.ycord;
            return;
        }
    }
}

function dragPoints(startingX, startingY, endingX, endingY, array, reachingWidth, reachingHeight) {
    let points = [];
    array.forEach(element => {
        if(Math.abs(element.xcord - startingX) <= reachingWidth && Math.abs(element.ycord - startingY) <= reachingHeight) {
            points.push(element);
        }
    });

    if(points.length !== 0) {
        /*if(areGlued)
            for (let point of points) {
                point.xcord = endingX;
                point.ycord = endingY;
            }
        else {*/
        let point = points[0];
        point.xcord = endingX;
        point.ycord = endingY;

        movePointToClosePoint(point);
    }
}

function dragCurve(startingX, startingY, endingX, endingY, curves, reachingWidth, reachingHeight) {
    curves.forEach(curve => {
        let curveBezierPoints = createPointsWithDeCastlejau(100, curve.points);
        if(isCurveClicked(curveBezierPoints, startingX, startingY, reachingWidth, reachingHeight)) {
            movePoints(curve.points, endingX - startingX, endingY - startingY);
        }
    });
}

function dragPage(startingX, startingY, endingX, endingY, points) {
    movePoints(points, endingX - startingX, endingY - startingY);
}

//rotate logic

// Funkcja obrotu punktu o kąt theta
function rotatePoint(point, angle, cx, cy) {
    // Przesunięcie punktu względem środka
    let dx = point.xcord - cx;
    let dy = point.ycord - cy;

    // Zastosowanie wzoru obrotu
    point.xcord = dx * Math.cos(angle) - dy * Math.sin(angle) + cx;
    point.ycord = dx * Math.sin(angle) + dy * Math.cos(angle) + cy;
}

function rotatePoints(points) {
    for (const point of points) {
        rotatePoint(point, data.angleRadians, canvasWidth / 2, canvasHeight / 2);
    }
}


export default {
    createNewCurve,
    addNewCurve,
    addPointsToCurve,
    moveCurveRight,
    moveCurveLeft,
    curveCopy,
    CurveUndo,
    getAllPointsFromActualPage,
    getAllCurvesFromActualPage,
    updateCurveSettings,
    isCurveClicked,
    dragPoints,
    dragCurve,
    dragPage,
    rotatePoints,
    getAllPointsFromCurves
};