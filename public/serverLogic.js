import data from './animationData.js';
import { canvasWidth, canvasHeight, takeComputedSizeForCanvas, getCanvasImgURL } from './script.js';
import animationLogic from './animationLogic.js';

// modal
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var modal_content  = document.getElementById("myModalContet");

// modal content functions
function popUpCastErrorModal() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p>You gave wrond data format, check if length is correct</p><br>`;
}

function popUpNotFoundModal() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p>Animation not found</p><br>`;
}

function popUpServerErrorModal() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p>Server Error</p><br>`;
}

function pupUpNotSuppoertedStatusCode() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p>not suppoerted response status</p><br>`;
}

function popUpModal(ID) {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p id="textInModal">Your's animation's id: ` + ID.ID + `</p><br>
        <p id="textInModal">Your authKey: ` + ID.authKey + `</p>`;
}

function popUpDeleteSuccessfullModal(ID) {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p>Successfully deleted animation with id: ` + ID.ID + `</p><br>`;
}

function popUpReadSuccessfullModal(ID) {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p>Successfully read animation with id: ` + ID.ID + `</p><br>`;
}

function popUpUpdateSuccessfullModal() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <p>Successfully updated animation</p><br>`;
}

// server connection functions
async function saveAnimationOrPut() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <form id="saveAnimationForm" class="modalForm">
            <label for="authKey">auth key:</label>
            <input type="text" id="authKey" name="authKey" value="none" class="authInput"><br>
            <label for="publicCheckbox">public:</label>
            <input type="checkbox" id="publicCheckbox" name="publicCheckbox" value="true" class="authInput"><br>
            <button type="submit" class="authInputButton">send</button>
    </form>`

    document.getElementById("saveAnimationForm").addEventListener("submit", async function(event) {
        event.preventDefault(); 

        const isPublic = document.getElementById("publicCheckbox").checked;
        const authKey  = document.getElementById("authKey").value;

        const newAnimation = JSON.parse(JSON.stringify(data.animation));
        newAnimation.public = isPublic;
        
        takeComputedSizeForCanvas();
        newAnimation.canvasWidth = canvasWidth;
        newAnimation.canvasHeight = canvasHeight;
        newAnimation.previewImage = getCanvasImgURL();
        var response;
        

        try {
            if(authKey !== "none") {
                newAnimation.authKey = authKey;
                response = await fetch('/put-animation', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newAnimation)
                });

                if (response.ok) {
                    popUpUpdateSuccessfullModal();
                    return;
                }

            } else {
                response = await fetch('/save-animation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newAnimation)
                });

                if (response.ok) {
                    const data = await response.json();
                    popUpModal(data);
                    console.log('Odpowiedź serwera:', data); 
                    return;
                }
            }

    
            switch (response.status) {
                case 400:
                    console.log("user gave wrong format of data");
                    popUpCastErrorModal();
                    break;
                case 404:
                    console.log("user gave data that is not in database")
                    popUpNotFoundModal();
                    break;
                default:
                    console.error("not suppoerted response status in save animation");
                    pupUpNotSuppoertedStatusCode();
                    break;
            }
        } catch (error) {
            popUpServerErrorModal();
            console.error('server error:', error);
        }
    });
}
document.getElementById("saveAnimation").addEventListener("click", saveAnimationOrPut);

async function getAnimationFromServer(ID, doIRefresh) {
        try {
            const response = await fetch(`/get-animation/${ID}`, {
                method: 'GET'
            });

            if (response.ok) {
                const animation = await response.json();
                takeComputedSizeForCanvas();
                animationLogic.animationToClientData(animation, canvasWidth, canvasHeight);
                popUpReadSuccessfullModal(animation);
                return;
            } else {
                switch (response.status) {
                    case 400:
                        console.log("user gave wrong format of data");
                        popUpCastErrorModal();
                        break;
                    case 404:
                        console.log("user gave data that is not in database")
                        popUpNotFoundModal();
                        break;
                    default:
                        console.error("not suppoerted response status in readAnimation");
                        pupUpNotSuppoertedStatusCode();
                        break;
                }
            }
        } catch (error) {
            popUpServerErrorModal();
            console.error('server error:', error);
        }

        if(doIRefresh) {
            window.location.href = "./";
            alert("wrong id");
        }
}

async function readAnimation() {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <form id="readAnimationForm" class="modalForm">
            <label for="readAnimationId">id:</label>
            <input type="text" id="readAnimationId" name="readAnimationId" required class="authInput"><br>
            <button type="submit" class="authInputButton">send</button>
    </form>`

    document.getElementById("readAnimationForm").addEventListener("submit", async function(event) {
        event.preventDefault(); 
        const ID = document.getElementById("readAnimationId").value;
        getAnimationFromServer(ID, false);
    });
}
document.getElementById("readAnimation").addEventListener("click", readAnimation);


const deleteAnimation = async function () {
    modal.style.display = "block";
    modal_content.innerHTML = 
        `<span class="close">&times;</span>
        <form id="deleteAnimationForm" class="modalForm">
            <label for="authKeyDeleteForm">auth key:</label>
            <input type="text" id="authKeyDeleteForm" name="authKeyDeleteForm" class="authInput" required><br>
            <label for="idDeleteForm">id:</label>
            <input type="text" id="idDeleteForm" name="idDeleteForm" class="authInput" required><br>
            <button type="submit" class="authInputButton">send</button>
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
                popUpDeleteSuccessfullModal(data);
                console.log(`Server's response:`, data); 
            } else {
                switch (response.status) {
                    case 400:
                        console.log("user gave wrong format of data");
                        popUpCastErrorModal();
                        break;
                    case 404:
                        console.log("user gave data that is not in database")
                        popUpNotFoundModal();
                        break;
                    default:
                        console.error("not suppoerted response status in deleteAnimation");
                        pupUpNotSuppoertedStatusCode();
                        break;
                }
            }
        } catch (error) {
            popUpServerErrorModal();
            console.error('server error:', error);
        }
    });
}
document.getElementById("deleteAnimation").addEventListener("click", deleteAnimation);

export default {
    getAnimationFromServer
}
