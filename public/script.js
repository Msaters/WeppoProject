import curvesLogic from './curvesLogic.js';
import drawingLogic from './drawingLogic.js';
import pageLogic from './pagesLogic.js';
import data from './animationData.js';
import pagesLogic from './pagesLogic.js';
import serverLogic from './serverLogic.js';
import animationLogic from './animationLogic.js';

// canvas
const canvas = document.getElementById('canvas');
canvas.width = canvas.offsetWidth; // Ustawienie na szerokość elementu w pikselach
canvas.height = canvas.offsetHeight; // Ustawienie na wysokość elementu w pikselach
export var canvasWidth = canvas.width;
export var canvasHeight = canvas.height;
const ctx = canvas.getContext("2d");

export function takeComputedSizeForCanvas() {
    canvas.width = canvas.offsetWidth; 
    canvas.height = canvas.offsetHeight; 
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
}

export function getCanvasImgURL() {
    ctx.fillStyle = '#a7a1a1'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    drawingLogic.updateWithoutClearingCanvas(data.actualPage.curves, ctx, canvasWidth, canvasHeight);
    const img = canvas.toDataURL('image/png');
    updateCanvas();
    return img;
}

// modal
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modal_content  = document.getElementById("myModalContet");

const urlParams = new URLSearchParams(window.location.search);
const URL_id = urlParams.get('id');
const initialize = () => {
    data.pointsVisibility = true;
    pageLogic.addNewPage(); 
    data.actualPage  = data.animation.pages[data.PageIndex];
    data.actualCurve = data.animation.pages[data.PageIndex].curves[data.actualCurveIndex];
    data.animation.canvasHeight = canvasHeight;
    data.animation.canvasWidth  = canvasWidth;
}

if(URL_id == null) {
    initialize();
} else {
    console.log(URL_id);
    document.getElementById("toggleInput").checked = false;
    serverLogic.getAnimationFromServer(URL_id, true);
}

export function updateCanvas() {
    drawingLogic.updateCanvas(data.actualPage.curves, ctx, canvasWidth, canvasHeight);
}

//animations undo
function addToAnimations() {
    if(data.pagesRollBackArray.length === data.pagesRollBackLimit) {
        data.pagesRollBackArray.shift();
    }

    data.pagesRollBackArray.push(JSON.parse(JSON.stringify(data.animation)));
}

function undoPage() {
    if(data.pagesRollBackArray.length == 0) {
        return;
    }

    const previousPageStage = data.pagesRollBackArray.pop();
    animationLogic.animationToClientData(previousPageStage, canvasWidth, canvasHeight);
    updateCanvas();
}
document.getElementById("undoPage").addEventListener("click", undoPage);

var isClicked = false;
let startingX;
let startingY;

// canvas event handlers
// adding point if none is chosen
canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    startingX = x;
    const y = Math.floor(event.clientY - rect.top);
    startingY = y;
    isClicked = true;

    if(data.dragOption === data.dragOptionEnum.NONE) {
        curvesLogic.addPointsToCurve(data.actualCurve, {"xcord": x, "ycord": y});
        addToAnimations();
        updateCanvas();
    }
});

//no more draging elements
canvas.addEventListener("mouseup", (event) => {
    isClicked = false;
});

// handle drag movement
let isFinishedDrawingAsync = true;
canvas.addEventListener("mousemove", async (event) => {
    if(isClicked === false || isFinishedDrawingAsync === false || data.dragOption === data.dragOptionEnum.NONE)
        return;

    let forAll = document.getElementById("togglePageSettingforAll").checked;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);
    const startingPoint = {
        "xcord": startingX,
        "ycord": startingY
    }
    const endingPoint = {
        "xcord": x,
        "ycord": y
    }
    let curve;
    let curves;
    let points;

    if(!forAll) {
        curves = [data.actualCurve];
        curve = data.actualCurve;
        points = curve.points;
    }  else {
        curves = curvesLogic.getAllCurvesFromActualPage();
        points = curvesLogic.getAllPointsFromActualPage();
    }

    let drawingPromise = new Promise((resolve) => {
        isFinishedDrawingAsync = false;
        switch (data.dragOption) {
            case data.dragOptionEnum.POINT:
                curvesLogic.dragPoints(startingX, startingY, x, y, points, data.dragRange , data.dragRange);
                break;
            case data.dragOptionEnum.CURVE:
                curvesLogic.dragCurve(startingX, startingY, x, y, curves, data.dragRange, data.dragRange);
                break;
            case data.dragOptionEnum.PAGE:
                const pointsPage = curvesLogic.getAllPointsFromActualPage();
                curvesLogic.dragPage(startingX, startingY, x, y, pointsPage);
                break;
        }

        updateCanvas();
        startingX = x;
        startingY = y;
        resolve(true);
    });

    isFinishedDrawingAsync = await drawingPromise;
    addToAnimations();
    return;
});

//roation
const rotateChosenOption = () => {
    console.log("siema");
    
    if(isFinishedDrawingAsync === false || data.dragOption === data.dragOptionEnum.NONE) {
        return;
    }

    let forAll = document.getElementById("togglePageSettingforAll").checked;
    let curves;

    if(!forAll) {
        curves = [data.actualCurve];
    }  else {
        curves = curvesLogic.getAllCurvesFromActualPage();
    }

    switch (data.dragOption) {
        case data.dragOptionEnum.CURVE:
            curvesLogic.rotatePoints(curvesLogic.getAllPointsFromCurves(curves));
            break;
        case data.dragOptionEnum.PAGE:
            curvesLogic.rotatePoints(curvesLogic.getAllPointsFromActualPage());
            break;
    }

    addToAnimations();
    updateCanvas();
}
document.getElementById("togglePageSettingRotate").addEventListener("click", rotateChosenOption);


document.getElementById("settingRotationForm").addEventListener("submit", (event) => {
    event.preventDefault();

    data.angleDegrees = document.getElementById("rotationInput").value;
    data.angleRadians = data.angleDegrees * Math.PI / 180;
})

// curve Logic for buttons
function addNewCurve() {
    curvesLogic.addNewCurve(data.actualPage.curves);
}
document.getElementById("addNewCurve").addEventListener("click", addNewCurve);

function moveCurveRight() {
    curvesLogic.moveCurveRight();
    updateCanvas();
}
document.getElementById("moveCurveRight").addEventListener("click", moveCurveRight);

function moveCurveLeft() {
    curvesLogic.moveCurveLeft();
    updateCanvas();
}
document.getElementById("moveCurveLeft").addEventListener("click", moveCurveLeft);

function curveCopy() {
    
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <form id="copyCurveForm" class="form-container column-group">
            <div style="display:flex; justify-content: space-evenly;">
                <div class="column-group inputGroup">
                    <label for="fromCopyCurve">from</label>
                    <input type="number" id="fromCopyCurve" name="fromCopyCurve" min=1 max=${data.actualPage.curves.length} required style="width:20vw;">
                </div>
                <div class="column-group inputGroup">
                    <label for="toCopyCurve">to</label>
                    <input type="number" id="toCopyCurve" name="toCopyCurve" min=1 max=${data.actualPage.curves.length} value=${data.actualCurveIndex + 1} required style="width:20vw;">
                </div>
            </div>
            <button type="submit" style="width: 10vw; margin: auto;">copy</button>
        </form>`;

    document.getElementById("copyCurveForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const indexFrom = document.getElementById("fromCopyCurve").value;
        const indexTo = document.getElementById("toCopyCurve").value;
        curvesLogic.curveCopy(indexFrom - 1, indexTo - 1);
        modal.style.display = "none";
        updateCanvas();
    });
}
document.getElementById("curveCopy").addEventListener("click", curveCopy);

function CurveUndo() {
    curvesLogic.CurveUndo(data.actualCurve);
    addToAnimations();
    updateCanvas();
}
document.getElementById("CurveUndo").addEventListener("click", CurveUndo);

function showActiveCurve() {
    data.isActiveHighlighted = document.getElementById("showActiveCurve").checked;
    updateCanvas();
}
document.getElementById("showActiveCurve").addEventListener("click", showActiveCurve);

// pages settings logic buttons 
function addNewPage() {
    pageLogic.addNewPage();
}
document.getElementById("addNewPage").addEventListener("click", addNewPage);

const movePageRight = () => {
    pageLogic.movePageRight();
    updateCurveCounter();
    updateCanvas();
}
document.getElementById("movePageRight").addEventListener("click", movePageRight);

const movePageLeft = () => {
    pageLogic.movePageLeft();
    updateCurveCounter();
    updateCanvas();
}
document.getElementById("movePageLeft").addEventListener("click", movePageLeft);


//settings
document.getElementById("settingsForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const R = document.getElementById("R").value;
    document.getElementById("R").value = "";
    const G = document.getElementById("G").value;
    document.getElementById("G").value = "";
    const B = document.getElementById("B").value;
    document.getElementById("B").value = "";
    const A = document.getElementById("A").value;
    document.getElementById("A").value = "";
    const LineWidth = document.getElementById("LineWidth").value;
    document.getElementById("LineWidth").value = "";
    const PointWidth = document.getElementById("PointWidth").value;
    document.getElementById("PointWidth").value = "";
    const PointHeight = document.getElementById("PointHeight").value;
    document.getElementById("PointHeight").value = "";

    console.log(LineWidth);
    
    
    switch (data.dragOption) {
        case data.dragOptionEnum.NONE:
        case data.dragOptionEnum.CURVE:
            curvesLogic.updateCurveSettings(data.actualCurve, R, G, B, A, LineWidth. PointWidth, PointHeight);
            break;

        case data.dragOptionEnum.PAGE:
            let curves = curvesLogic.getAllCurvesFromActualPage();
            for (const curve of curves) {
                curvesLogic.updateCurveSettings(curve, R, G, B, A, LineWidth, PointWidth, PointHeight);
                console.log(curve);   
            }
            break;
    }

    updateCanvas();
});

document.getElementById("reset").addEventListener("click", (event) => {
    
    let settings = data.actualCurve.settings;
    if(settings.r === 0 && settings.g === 0 && settings.b === 0 && settings.lineWidth === 3 && settings.pointWidth === 10 && settings.pointHeight === 10 && settings.a === 1) {
        document.getElementById("R").value = 0;
        document.getElementById("G").value = 0;
        document.getElementById("B").value = 0;
        document.getElementById("A").value = 1;
        document.getElementById("LineWidth").value = 3;
    } else {
        settings.r = 0;
        settings.g = 0;
        settings.b = 0;
        settings.a = 1;
        settings.lineWidth = 2;
        settings.pointWidth = 10;
        settings.pointHeight = 10;
    }
    updateCanvas();
});

document.getElementById("toggleInput").addEventListener("click", () => {
    const value = document.getElementById("toggleInput").checked;
    if(value === true) {
        data.pointsVisibility = true;
    } else {
        data.pointsVisibility = false;
    }
    updateCanvas();
});


//updating counters 
export function updatePageCounter() {
    document.getElementById("pagesCounter").innerHTML = 
    `${data.PageIndex + 1}/${data.animation.pages.length}`;
}

export function updateCurveCounter() {
    document.getElementById("curvesCounter").innerHTML = 
    `${data.actualCurveIndex + 1}/${data.actualPage.curves.length}`;
}

//page options functions
function clearPage() {
    pageLogic.clearPage();
    updateCanvas();
}
document.getElementById("clearPage").addEventListener("click", clearPage);

function copyPage() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <form id="copyPageForm" class="form-container column-group">
            <div style="display:flex; justify-content: space-evenly;">
                <div class="column-group">
                    <label for="fromCopy">from</label>
                    <input type="number" id="fromCopy" name="fromCopy" min=1 max=${data.animation.pages.length} required style="width:20vw;">
                </div>
                <div class="column-group">
                    <label for="toCopy">to</label>
                    <input type="number" id="toCopy" name="toCopy" min=1 max=${data.animation.pages.length} value=${data.PageIndex + 1} required style="width:20vw;">
                </div>
            </div>
            <button type="submit" style="width: 10vw; margin: auto;">copy</button>
        </form>`;

    document.getElementById("copyPageForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        const indexFrom = document.getElementById("fromCopy").value;
        const indexTo = document.getElementById("toCopy").value;
        pagesLogic.copyPage(indexFrom - 1, indexTo - 1);
        modal.style.display = "none";
        updateCurveCounter();
        updateCanvas();
    });
}
document.getElementById("copyPage").addEventListener("click", copyPage);

function deletePage() {
    pageLogic.deletePage();
    updateCanvas();
}
document.getElementById("deletePage").addEventListener("click", deletePage);

const resizePage = function() {
    takeComputedSizeForCanvas();
    animationLogic.animationToClientData(data.animation, canvasWidth, canvasHeight);
    updateCanvas();
}
document.getElementById("resizePage").addEventListener("click", resizePage);

const showPreviousPage = function() {
    data.isShowingPreviousPage = document.getElementById("showPreviousPage").checked;
    updateCanvas();
}
document.getElementById("showPreviousPage").addEventListener("click", showPreviousPage);


//Drag options
const radioList = document.getElementsByClassName("radioPageSettings")
function setRadioValues(target) {
    if(target.checked === false) {
        data.dragOption = "none";
        document.getElementById("togglePageSettingNone").checked = true;
        return;
    }

    // only one at a time
    for (const element of radioList) {
        element.checked = false;
    }
    target.checked = true; 
    
    // set dragOption
    switch(target.id) {
        case "togglePageSettingNone":
            data.dragOption = data.dragOptionEnum.NONE;
            break;
        case "togglePageSettingPoint":
            data.dragOption = data.dragOptionEnum.POINT;
            break;
        case "togglePageSettingCurve":
            data.dragOption = data.dragOptionEnum.CURVE;
            break;
        case "togglePageSettingPage":
            data.dragOption = data.dragOptionEnum.PAGE;
            break;
      }
}

for (const element of radioList) {
    element.addEventListener("click", (event) => {
        setRadioValues(event.target);
    });
}

window.onclick = function(event) {
    if (event.target == modal || event.target.classList.contains("close")) {
      modal.style.display = "none";
    }

}

// animation
document.getElementById("showAnimation").addEventListener("click", () => {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <div class="column-group" style="width: 35%">
            <label for="delay">Przerwa pomiedzy animacjami w milisekundach</label>
            <input type="number" id="delay" name="delay" min=5 max=5000 value=400 required><br>
        </div>
        <button id="start">start</button>`;

    document.getElementById("start").addEventListener("click", () => {
        const delay = document.getElementById("delay").value;
        drawingLogic.showAnimation(data.animation, ctx, canvasWidth, canvasHeight, delay);
        modal.style.display = "none";
    });
});


// button animation
document.querySelectorAll('.button-14').forEach(button => {
    button.addEventListener('click', (event) => {
      const target = event.target;
      target.classList.remove('animate'); // Reset animację
      void target.offsetWidth; // Trigger reflow (reset CSS animacji)
      target.classList.add('animate'); // Dodaj klasę ponownie
    });
});