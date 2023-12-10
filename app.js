const express = require('express');
const foodRoutes = require('./food-api/food-routes');

const app = express();
const port = 8080;

app.use('/', foodRoutes);

// Middleware untuk menangani kesalahan 404 (Not Found)
app.use((req, res, next) => {
    res.status(404).send('Halaman tidak ditemukan');
});

// Middleware untuk menangani kesalahan umum (500 Internal Server Error)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Terjadi kesalahan pada server');
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
