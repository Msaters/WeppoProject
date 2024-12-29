require('dotenv').config();

const express = require('express');
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

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});

