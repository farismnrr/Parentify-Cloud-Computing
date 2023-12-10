const express = require('express');
const router = express.Router();
const {
    berasPutih,
    berasMerah,
    berasHitam,
    berasKetan,
    jagung,
    jelai,
    milet,
    oatmeal,
    quinoa,
    soba,
} = require('../handler/handler-biji');

router.get('/berasPutih', (req, res) => {
    res.send(berasPutih);
});

router.get('/berasMerah', (req, res) => {
    res.send(berasMerah);
});

router.get('/berasHitam', (req, res) => {
    res.send(berasHitam);
});

router.get('/berasKetan', (req, res) => {
    res.send(berasKetan);
});

router.get('/jagung', (req, res) => {
    res.send(jagung);
});

router.get('/jelai', (req, res) => {
    res.send(jelai);
});

router.get('/milet', (req, res) => {
    res.send(milet);
});

router.get('/oatmeal', (req, res) => {
    res.send(oatmeal);
});

router.get('/quinoa', (req, res) => {
    res.send(quinoa);
});

router.get('/soba', (req, res) => {
    res.send(soba);
});

module.exports = router;
