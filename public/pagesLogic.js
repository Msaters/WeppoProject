import data from './animationData.js';
import curvesLogic from './curvesLogic.js';
import { updatePageCounter } from './script.js';

function createNewPage() {
    return {
        "curves": [],
        "curveIndex": 0,
    }
}

function addNewPage() {
    data.animation.pages.push(createNewPage());
    updateActualPage();
}

function updateActualPage() {
    data.actualPage = data.animation.pages[data.PageIndex];
    if(data.animation.pages[data.PageIndex].curves.length === 0)
        curvesLogic.addNewCurve(data.animation.pages[data.PageIndex].curves);
    data.actualCurveIndex = data.actualPage.curveIndex;
    data.actualCurve = data.actualPage.curves[data.actualCurveIndex];
    updatePageCounter();
}

function movePageRight() {
    if(data.PageIndex === data.animation.pages.length - 1) {
        console.log("jestes juz na ostatniej stronie");
        return;
    }

    data.PageIndex++;
    updateActualPage();
}

function movePageLeft() {
    if(data.PageIndex === 0) {
        console.log("jestes juz na pierwszej stronie");
        return;
    }

    data.PageIndex--;
    updateActualPage();
}

function clearPage() {
    data.animation.pages[data.PageIndex] = createNewPage();
    updateActualPage();

}

function copyPage(index1, index2) {
    // to do hard copy
}

function deletePage(index) {
    if(data.animation.pages.length === 1) {
        clearPage();
        return;
    }

    data.animation.pages.splice(index, 1);
    if(data.PageIndex === data.animation.pages.length) {
        movePageLeft();
        return;
    }

    updateActualPage();
}

export default {
    addNewPage,
    movePageRight,
    movePageLeft,
    clearPage,
    copyPage,
    deletePage
}