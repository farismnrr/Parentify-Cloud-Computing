const express = require('express');
const routerBiji = require('./router/router-biji');
const routerBuah = require('./router/router-buah');
const routerBumbu = require('./router/router-bumbu');
const routerDagingProtein = require('./router/router-daging-protein');
const routerKacang = require('./router/router-kacang');
const routerMakananLaut = require('./router/router-makanan-laut');
const routerSayur = require('./router/router-sayur');

const foodRoutes = express.Router();

foodRoutes.use('/foods', routerBiji);
foodRoutes.use('/foods', routerBuah);
foodRoutes.use('/foods', routerBumbu);
foodRoutes.use('/foods', routerDagingProtein);
foodRoutes.use('/foods', routerKacang);
foodRoutes.use('/foods', routerMakananLaut);
foodRoutes.use('/foods', routerSayur);

// Penanganan kesalahan 404
foodRoutes.use((req, res, next) => {
    res.status(404).json({
        status: 'error 404',
        message: 'data not found',
    });
});

// Penanganan kesalahan umum
foodRoutes.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error 500',
        message: 'internal server error',
    });
});

module.exports = foodRoutes;
