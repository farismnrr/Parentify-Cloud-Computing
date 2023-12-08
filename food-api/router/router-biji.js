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

router.get('/beras-putih', (req, res) => {
    res.send(berasPutih);
});

router.get('/beras-merah', (req, res) => {
    res.send(berasMerah);
});

router.get('/beras-hitam', (req, res) => {
    res.send(berasHitam);
});

router.get('/beras-ketan', (req, res) => {
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
