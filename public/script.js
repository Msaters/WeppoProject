var points = [];

function putPointsOnCanvas(params) {
    // to do
}

function addPoint(x, y) {
    // Wyświetl kliknięcie
    const point = document.createElement('div');
    point.style.position = 'absolute';
    point.style.width = '10px';
    point.style.height = '10px';
    point.style.backgroundColor = 'red';
    point.style.borderRadius = '50%';
    point.style.left = `${x - 5}px`;
    point.style.top = `${y - 5}px`;
    canvas.appendChild(point);
}

const canvas = document.getElementById('canvas');
canvas.addEventListener('click', (event) => {
    console.log(event);
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log({x, y});
    console.log("clientX: ", event.clientX);
    console.log("clientY: ", event.clientX);
    console.log("rectleft: ", rect.left);
    console.log("rectright: ", rect.right);
    points.push({"xcord": x, "ycord": y});

    addPoint(x, y);
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
                console.log('Odpowiedź serwera:', data); 
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
            <p id="textInModal" style="color:red">Podales nie poprawne ID ` + ID.ID + `</p>`;
        }
    });
}

async function getCordinates() {
    pupUpModalForm();
}