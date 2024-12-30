// creating Data
var PageIndex = 0;
var actualCurveIndex = 0;
var actualPage;
var actualCurve;
var pointsVisibility;
var isActiveHighlighted = false;
var isShowingPreviousPage = false;
var dragRange = 10;

// Kąt obrotu w stopniach
let angleDegrees = 10;
let angleRadians = angleDegrees * Math.PI / 180; // Konwersja na radiany

const dragOptionEnum = {
    NONE: "none",
    POINT: "point",
    CURVE: "curve",
    PAGE: "page"
};
var dragOption = dragOptionEnum.NONE;

var animation = {
    type: "animation",
    pages: []
}
var pagesRollBackArray = [];
var pagesRollBackLimit = 20;

export default {
    animation,
    actualCurveIndex,
    PageIndex,
    actualCurve,
    actualPage,
    pointsVisibility,
    isActiveHighlighted,
    dragOption,
    dragOptionEnum,
    dragRange,
    isShowingPreviousPage,
    angleRadians,
    pagesRollBackArray,
    pagesRollBackLimit
}