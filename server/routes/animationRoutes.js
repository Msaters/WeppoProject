const express = require('express');
const mongoose = require('mongoose');
const Animation = require('../models/Animaiton');
const router = express.Router();

router.post('/save-animation', (req, res) => {
    const animation = req.body;

    const newAnimation = new Animation(animation);

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

router.put('/put-animation', async (req, res) => {
    try {
        const clientAnimation = req.body;

        const query = {
            authKey: clientAnimation.authKey
        };

        const updateDoc = {
            $set: {
                pages: clientAnimation.pages,
                canvasHeight: clientAnimation.canvasHeight,
                canvasWidth: clientAnimation.canvasWidth,
                public: clientAnimation.public
            },
          };
        
        const animation = await Animation.updateOne(query, updateDoc);

        if(animation.matchedCount === 0) {
            console.log("No documents matched the query. Updated 0 documents.");
            res.status(404).send();
            return;
        }
        
        
        res.status(200).send();

    } catch(err) {
        if(err instanceof mongoose.Error.CastError) {
            console.log("CastError while updating animation", err);
            res.status(400).send();
            return;
        }

        console.log("Error updating animation: ", err);
        res.status(500).send(err);
    }
});

router.get('/get-animation/:id', async (req, res) => {
    try {
        const ID = req.params.id;
        
        const query = {
            _id: ID
        };
        
        const animation = await Animation.findOne(query);

        if(animation === null) {
            console.log("No documents matched the query. Read 0 documents.");
            res.status(404).send();
            return;
        }

        const { _id, authKey, __v,...newAnimation } = animation.toObject();
        newAnimation.ID = animation._id;
        res.status(200).send(newAnimation);

    } catch(err) {
        if(err instanceof mongoose.Error.CastError) {
            console.log("CastError while reading animation", err);
            res.status(400).send();
            return;
        }

        console.log("Error reading animation: ", err);
        res.status(500).send(err);
    }
});

async function delteAll() {
    console.log("deleting");
    
    await Animation.deleteMany({public: true});
    await Animation.deleteMany({public: false});
}

router.delete('/delete-animation', async (req, res) => {
    try {
        console.log(req.body);
        const authData = req.body;

        const query = {
            _id: authData.ID,
            authKey: authData.authKey
        }
        const result = await Animation.deleteOne(query);

        if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");
            res.status(201).send({ID: authData.ID});
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