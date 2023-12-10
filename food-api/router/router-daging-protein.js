const express = require('express');
const router = express.Router();

const {
    dagingSapi,
    dagingKambing,
    dagingAyam,
    dagingBebek,
    dagingDomba,
    telur,
} = require('../handler/handler-daging-protein');

router.get('/dagingSapi', (req, res) => {
    res.send(dagingSapi);
});

router.get('/dagingKambing', (req, res) => {
    res.send(dagingKambing);
});

router.get('/dagingAyam', (req, res) => {
    res.send(dagingAyam);
});

router.get('/dagingBebek', (req, res) => {
    res.send(dagingBebek);
});

router.get('/dagingDomba', (req, res) => {
    res.send(dagingDomba);
});

router.get('/telur', (req, res) => {
    res.send(telur);
});

module.exports = router;
