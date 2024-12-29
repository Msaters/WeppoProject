import data from './animationData.js';
import { updateCanvas, updatePageCounter, updateCurveCounter } from './script.js';

function updateClientSideAnimationData() {
    data.PageIndex = 0;
    data.actualCurveIndex = 0;
    data.actualPage = data.animation.pages[0];
    data.actualCurve = data.actualPage.curves[0];
}

// resizes animation to new screen resolution
function resizeAnimation(animation, newAnimation, canvasWidth, canvasHeight) {
    let widthRatio = canvasWidth /animation.canvasWidth;
    let heightRatio = canvasHeight / animation.canvasHeight;

    for (const page of newAnimation.pages) {
        for (const curve of page.curves) {
            for (const point of curve.points) {
                point.xcord = Math.floor(widthRatio * point.xcord);
                point.ycord = Math.floor(heightRatio * point.ycord);
            }
        }
    }

    newAnimation.canvasWidth = canvasWidth;
    newAnimation.canvasHeight = canvasHeight;
}

function animationToClientData(animation, canvasWidth, canvasHeight) {
    let newAnimation = JSON.parse(JSON.stringify(animation));
    resizeAnimation(animation, newAnimation, canvasWidth, canvasHeight);
    data.animation = newAnimation;
    updateClientSideAnimationData();
    updateCurveCounter();
    updatePageCounter();
    updateCanvas();
}

export default {
    animationToClientData,
    resizeAnimation
}