import data from './animationData.js';

// modal
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modal_content  = document.getElementById("myModalContet");


function popUpModal(ID) {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p id="textInModal">Your's animation's id: ` + ID.ID + `</p><br>
        <p id="textInModal">Your authKey: ` + ID.authKey + `</p>`;
}

// server connection functions
async function saveAnimation() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <form id="saveAnimationForm" class="modalForm">
            <label for="authKey">auth key:</label>
            <input type="text" id="authKey" name="authKey" value="none"><br>
            <label for="publicCheckbox">public:</label>
            <input type="checkbox" id="publicCheckbox" name="publicCheckbox" value="true"><br>
            <button type="submit">send</button>
    </form>`

    document.getElementById("saveAnimationForm").addEventListener("submit", async function(event) {
        event.preventDefault(); 

        const isPublic = document.getElementById("publicCheckbox").checked;
        const authKey  = document.getElementById("authKey").value;

        const newAnimation = JSON.parse(JSON.stringify(data.animation));
        if(authKey !== "none") {
            // TODO: HTTP PUT
            newAnimation.authKey = authKey;
        }
        // TODO: else HTTP POST 

        newAnimation.public = isPublic;

        try {
            const response = await fetch('/save-animation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAnimation)
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
    });
}
document.getElementById("saveAnimation").addEventListener("click", saveAnimation);


/*function pupUpModalForm() {
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
}*/

function popUpDeleteSuccessfullModal() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p>Delete animation with id: ` + ID.ID + `</p><br>`;
}

function popUpDeleteCastErrorModal() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p>You gave wrond data format, check if length is correct</p><br>`;
}

function popUpDeleteNotFoundModal() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p>Animation not found, check if length is correct</p><br>`;
}

const deleteAnimation = function () {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <form id="deleteAnimationForm" class="modalForm">
            <label for="authKeyDeleteForm">auth key:</label>
            <input type="text" id="authKeyDeleteForm" name="authKeyDeleteForm" class="authInput" required><br>
            <label for="idDeleteForm">id:</label>
            <input type="text" id="idDeleteForm" name="idDeleteForm" class="authInput" required><br>
            <button type="submit" class="authInput">send</button>
    </form>`

    document.getElementById("deleteAnimationForm").addEventListener("submit", async function(event) {
        event.preventDefault(); 

        const authKey = document.getElementById("authKeyDeleteForm").value;
        const ID  = document.getElementById("idDeleteForm").value;

        try {
            const response = await fetch('/delete-animation', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    authKey: authKey, 
                    ID: ID
                })
            });

            if (response.ok) {
                const data = await response.json();
                popUpDeleteSuccessfullModal();
                console.log(`Server's response:`, data); 
            } else {
                switch (response.status) {
                    case 400:
                        console.log("user gave wrong format of data");
                        popUpDeleteCastErrorModal();
                        break;
                    case 404:
                        console.log("user gave data that is not in database")
                        popUpDeleteCastErrorModal();
                        break;
                    default:
                        console.error("not suppoerted response status in deleteAnimation");
                        break;
                }
            }
        } catch (error) {
            console.error('Błąd sieci:', error);
        }
    });
}
document.getElementById("deleteAnimation").addEventListener("click", deleteAnimation);

export default {

}
