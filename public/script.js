import curvesLogic from './curvesLogic.js';
import drawingLogic from './drawingLogic.js';
import pageLogic from './pagesLogic.js';
import data from './animationData.js';

const canvas = document.getElementById('canvas');
canvas.width = canvas.offsetWidth; // Ustawienie na szerokość elementu w pikselach
canvas.height = canvas.offsetHeight; // Ustawienie na wysokość elementu w pikselach
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ctx = canvas.getContext("2d");

const initialize = () => {
    data.pointsVisibility = true;
    pageLogic.addNewPage(); 
    curvesLogic.addNewCurve(data.animation.pages[data.PageIndex].curves);
    data.actualPage = data.animation.pages[data.PageIndex];
    data.actualCurve = data.animation.pages[data.PageIndex].curves[data.actualCurveIndex];
}
initialize();

function updateCanvas() {
    drawingLogic.updateCanvas(data.actualPage.curves, ctx, canvasWidth, canvasHeight);
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    curvesLogic.addPointsToCurve(data.actualCurve, {"xcord": Math.floor(x), "ycord": Math.floor(y)});
    updateCanvas();
});


// curve Logic for buttons
function addNewCurve() {
    curvesLogic.addNewCurve(data.actualPage.curves);
}
document.getElementById("addNewCurve").addEventListener("click", addNewCurve);

function moveCurveRight() {
    curvesLogic.moveCurveRight();
}
document.getElementById("moveCurveRight").addEventListener("click", moveCurveRight);

function moveCurveLeft() {
    curvesLogic.moveCurveLeft();
}
document.getElementById("moveCurveLeft").addEventListener("click", moveCurveLeft);

function CurveUndo() {
    curvesLogic.CurveUndo(data.actualCurve);
    updateCanvas();
}
document.getElementById("CurveUndo").addEventListener("click", CurveUndo);

// pages logic buttons
function addNewPage() {
    pageLogic.addNewPage();
}
document.getElementById("addNewPage").addEventListener("click", addNewPage);

const movePageRight = () => {
    pageLogic.movePageRight();
    console.log(data.animation);
    updateCanvas();
}
document.getElementById("movePageRight").addEventListener("click", movePageRight);

const movePageLeft = () => {
    pageLogic.movePageLeft();
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

    let settings = data.actualCurve.settings;
    if(PointWidth !== "" && PointHeight !== "") {
        settings.pointWidth = PointWidth;
        settings.pointHeight = PointHeight;
    }

    settings.r = R;
    settings.g = G;
    settings.b = B;
    settings.a = A;
    settings.lineWidth = LineWidth;
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












// modal
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modal_content  = document.getElementById("myModalContet");

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

function popUpModal(ID) {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p id="textInModal">Twoje id: ` + ID.ID + `</p>`;
}

span.onclick = function() {
    modal.style.display = "none";
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

async function saveCordinates() {
    try {
        const response = await fetch('/save-coordinates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(points)
        });

        if (response.ok) {
            const data = await response.json();
            popUpModal(data);
            console.log('Odpowiedź serwera:', data); 
        } else {
            console.error('Błąd podczas zapisu współrzędnych');
        }
    } catch (error) {
        console.error('Błąd sieci:', error);
    }
}


function pupUpModalForm() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <form id="idForm">
            <label for="AnimationId">Animation Id:</label>
            <input type="text" id="AnimationId" name="AnimationId" required><br>
            <button type="submit">Wyślij</button>
    </form>`

    // Funkcja do obsługi formularza
    document.getElementById("idForm").addEventListener("submit", async function(event) {
        event.preventDefault();  // Zapobiega domyślnej akcji formularza (przeładowanie strony)
        
        const ID = document.getElementById("AnimationId").value;
        const formData = {
            ID: ID
        };

        let alert_msg = "";
        try {
            const response = await fetch('/get-coordinates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                drawPointsFromArrayToCanvas(data);
                modal.style.display = "none";
            } else {
                if(response.status == 404) {
                    alert_msg = 'Nie poprawne ID';
                    console.error('Błąd podczas wpisu ID');
                } else {
                    console.error('Błąd serwera');
                    alert_msg = 'Błąd serwera';
                }
            }
        } catch (error) {
            console.error('Błąd sieci:', error);
            alert_msg = 'Błąd sieci';
        }

        if(alert_msg != "") {
            console.log("alercik " + alert_msg);
            modal_content.innerHTML = 
            `<span class="close">&times;</span>
            <p id="textInModal" style="color:red">Podales nie poprawne ID </p>`;
        }
    });
}

async function getCordinates() {
    pupUpModalForm();
}

