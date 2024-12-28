require('dotenv').config();

const express = require('express');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware do obsługi statycznych plików HTML
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint do zapisu współrzędnych
app.use(express.json());

// db
const connectDB = require('./server/database/db');

// connect to db
connectDB();

// Animation Models
const Animation = require('./server/models/Animaiton');

// routers
const animationRoutes = require('./server/routes/animationRoutes');


// using router
app.use('/', animationRoutes);

function getAnimationByID(Id) {
    return new Promise((res, rej) => {
        const rl = readline.createInterface({
            input: fs.createReadStream('coordinates.json'), // Plik do odczytu
            output: process.stdout,
            terminal: false
        });

        // Dla każdej linii pliku
        var obj = "null";
        rl.on('line', (line) => {
            const trimmedLine = line.trim();
            if(trimmedLine) {
                try {
                    const jsonObject = JSON.parse(trimmedLine);
                    if(jsonObject.ID === Id) {
                        obj = jsonObject;
                        rl.close();
                    }
                } catch (error) {
                    console.error('Błąd podczas parsowania JSON:', error);
                    rej({error: "serverError", errorMsg: error});
                }
            }
        });

        // Po zakończeniu odczytu pliku
        rl.on('close', () => {
            if(obj == "null")
                rej({error: "IdNotFound", errorMsg: "Id not found"}); // nie znaleziono ID w pliku
            res(obj);
        });
    });
}

app.post('/get-coordinates', async (req, res) => {
    const ID = req.body;
    console.log("in post /get-coordinates with id: " + ID.ID);

    const IDquery = getAnimationByID(ID.ID);
    IDquery
    .then((value) => {
        if(value == null) {
            return res.status(500).send({ error: 'Obj is null, Błąd serwera' });
        }

        console.log("returning object ", value)
        res.status(200).send(value.coordinates);
    })
    .catch(({error, errorMsg}) => {
        if(error === "serverError") {
            return res.status(500).send({ error: 'Błąd serwera' });
        }

        if(error === "IdNotFound") {
            return res.status(404).send({ error: 'Nie poprawne ID' });
        }
    });
    //dodac tutaj zeby wyslalo tego json do klienta po hashu
});


app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});

