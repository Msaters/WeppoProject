// creating Data
var PageIndex = 0;
var actualCurveIndex = 0;
var actualPage;
var actualCurve;
var pointsVisibility;
var isActiveHighlighted = false;
var dragRange = 10;

const dragOptionEnum = {
    NONE: "none",
    POINT: "point",
    CURVE: "curve",
    PAGE: "page"
};
var dragOption = dragOptionEnum.NONE;

var animation = {
    type: "animation",
    pages: [],
    ID: 0,
    //PreviewImg: Img
}

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
    dragRange
}