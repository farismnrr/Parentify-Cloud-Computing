const express = require('express');
const routerBiji = require('./router/router-biji');
const routerBuah = require('./router/router-buah');
const routerBumbu = require('./router/router-bumbu');
const routerDagingProtein = require('./router/router-daging-protein');
const routerKacang = require('./router/router-kacang');
const routerMakananLaut = require('./router/router-makanan-laut');
const routerSayur = require('./router/router-sayur');
const routerAll = require('./router/router-all');

const foodRoutes = express.Router();

foodRoutes.use(routerBiji);
foodRoutes.use(routerBuah);
foodRoutes.use(routerBumbu);
foodRoutes.use(routerDagingProtein);
foodRoutes.use(routerKacang);
foodRoutes.use(routerMakananLaut);
foodRoutes.use(routerSayur);
foodRoutes.use(routerAll);

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
