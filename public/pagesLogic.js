import data from './animationData.js';

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

export default {
    addNewPage,
}