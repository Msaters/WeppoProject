const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Point Schema
const pointSchema = new Schema({
    xcord: { type: Number, required: true },
    ycord: { type: Number, required: true },
});

// Curve Schema
const curveSchema = new Schema({
    type: { type: String, default: "Curve", required: true },
    settings: {
        r: { type: Number, required: true },
        g: { type: Number, required: true },
        b: { type: Number, required: true },
        a: { type: Number, required: true },
        lineWidth: { type: Number, required: true },
        pointWidth: { type: Number, default: 10, required: true },
        pointHeight: { type: Number, default: 10, required: true },
    },
    points: { type: [pointSchema], default: [], required: true }, 
});

// Page Schema
const pageSchema = new Schema({
    curves: { type: [curveSchema], default: [], required: true },
    curveIndex: { type: Number, default: 0, required: true }
})

// Animation Schema
const animationSchema = new Schema({
    pages: { type: [pageSchema], default: [], required: true },
    previewImage: { type: String },
    ID: { type: mongoose.Schema.Types.ObjectId, auto: true },
    authKey: { type: mongoose.Schema.Types.ObjectId, auto: true },
    public: { type: Boolean, required: true }
})

// Export the Animation Model
module.exports = mongoose.model('Animation', animationSchema);
