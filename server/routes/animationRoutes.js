const express = require('express');
const mongoose = require('mongoose');
const Animation = require('../models/Animaiton');
const router = express.Router();

router.post('/save-animation', (req, res) => {
    const animation = req.body;

    console.log("animation came");
    console.log(animation);
    const newAnimation = new Animation(animation);

    // to do
    // if authKey then try to update

    newAnimation.save()
        .then((savedAnimation) => {
            console.log('Animation saved!');
            console.log('Animation ID:', savedAnimation.ID); 
            console.log('Auth Key:', savedAnimation.authKey);
            res.status(201).send({
                ID: savedAnimation.ID,
                authKey: savedAnimation.authKey
            });
        })
        .catch((err) => {
            console.error('Error saving animation:', err)
            res.status(500).send(err);
        });
});

router.delete('/delete-animation', async (req, res) => {
    try {
        console.log(req.body);
        const authData = req.body;

        const query = {
            ID: authData.ID,
            authKey: authData.authKey
        }
        const result = await Animation.deleteOne(query);

        if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");
            res.status(201).send();
        } else {
            console.log("No documents matched the query. Deleted 0 documents.");
            res.status(404).send();
        }
    } catch(err) {
        if(err instanceof mongoose.Error.CastError) {
            console.log("CastError while deleting");
            res.status(400).send();
            return;
        }

        console.log("Error deleting animation: ", err);
        res.status(500).send(err);
    }
});


module.exports = router;