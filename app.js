// app.js (plik serwera Express)
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware do obsługi statycznych plików HTML
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint do zapisu współrzędnych
app.use(express.json());
app.post('/save-coordinates', (req, res) => {
    const coordinates = req.body;
    console.log("coordinates came");
    console.log(coordinates);

    // Zapisz współrzędne do pliku JSON
    fs.appendFile('coordinates.json', JSON.stringify(coordinates) + '\n', (err) => {
        if (err) {
            console.error('Błąd podczas zapisu:', err);
            return res.status(500).send('Błąd serwera');
        }
        res.status(200).send('Współrzędne zapisane');
    });

    // dodac klient dostaje hash
});

app.get('/get-coordinates', (req, res) => {
    //dodac tutaj zeby wyslalo tego json do klienta po hashu
    //dodac tam przy okazji page
});

// Uruchom serwer
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});

/* Utwórz folder "public" w tym samym katalogu co app.js i umieść poniższy kod HTML w pliku index.html */
