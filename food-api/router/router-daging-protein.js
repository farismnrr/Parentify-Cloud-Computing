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

router.get('/daging-sapi', (req, res) => {
    res.send(dagingSapi);
});

router.get('/daging-kambing', (req, res) => {
    res.send(dagingKambing);
});

router.get('/daging-ayam', (req, res) => {
    res.send(dagingAyam);
});

router.get('/daging-bebek', (req, res) => {
    res.send(dagingBebek);
});

router.get('/daging-domba', (req, res) => {
    res.send(dagingDomba);
});

router.get('/telur', (req, res) => {
    res.send(telur);
});

module.exports = router;
