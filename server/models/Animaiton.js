const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;

// Point Schema
const pointSchema = new Schema({
    xcord: { type: Number, required: true },
    ycord: { type: Number, required: true },
}, { _id: false });

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
}, { _id: false });

// Page Schema
const pageSchema = new Schema({
    curves: { type: [curveSchema], default: [], required: true },
    curveIndex: { type: Number, default: 0, required: true }
}, { _id: false })

// Animation Schema
const animationSchema = new Schema({
    pages: { type: [pageSchema], default: [], required: true },
    previewImage: { type: String },
    authKey: { type: String, default: uuidv4 },
    public: { type: Boolean, required: true },
    canvasWidth: { type: Number, required: true },
    canvasHeight: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
})

animationSchema.virtual('ID').get(function () {
    return this._id;
});

animationSchema.set('toJSON', { virtuals: true });

// Export the Animation Model
module.exports = mongoose.model('Animation', animationSchema);
