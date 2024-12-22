/*

Animation {
    "Pages": Page[],
    "PreviewImage": Img,
    "ID": id
}

Page {
    "Curves": Curve[]
}

Curve {
    "settings" : {
        "r": ,
        "g": ,
        "b": ,
        "a": ,
        "width": 
    },

    "points": [
        {
            "xcord": ,
            "ycord": 
        }
    ]

}


*/
import data from './script.js';

function createNewPage() {
    return {
        "curves": []
    }
}

function addNewPage() {
    data.animation.pages.push(createNewPage());
}

function movePageRight(params) {
    // to do
}

function movePageLeft(params) {
    // to do
}

//document.getElementById("settingsForm").addEventListener("submit", async function(event) {
//to do


export default {
    addNewPage,
}