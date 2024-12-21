import { createPointsWithDeCastlejau } from "/drawingBezierLogic.js";

var points = [];
const canvas = document.getElementById('canvas');
canvas.width = canvas.offsetWidth; // Ustawienie na szerokość elementu w pikselach
canvas.height = canvas.offsetHeight; // Ustawienie na wysokość elementu w pikselach
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var ctx = canvas.getContext("2d");

function drawPoint(x, y, r, g, b) {
    // to do, dodac kolorki 
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(Math.floor(x), Math.floor(y), 10, 10);
}

function drawLine(point1, point2) {
    // to do, dodac kolorki ctx.fillStyle = 
    // grubosc itp
    
}

function updateCurve(arr) {
    // dodaj punkty
    for(let i = 0; i < arr.length; i++) {
        drawPoint(arr[i].xcord, arr[i].ycord, 0, 26, 0);
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

function updateCanvas(arr) {
    console.log("clearing canvas");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //byc moze wiecej curvow
    updateCurve(arr);
}

canvas.addEventListener('click', (event) => {
    //console.log(event);
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log({x, y});
    points.push({"xcord": x, "ycord": y});

    updateCanvas(points);
});



var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modal_content  = document.getElementById("myModalContet");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

function popUpModal(ID) {
    console.log("poping Modal")
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p id="textInModal">Twoje id: ` + ID.ID + `</p>`;
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

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

function drawPointsFromArrayToCanvas(array) {
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        addPoint(element.xcord, element.ycord);
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