const express = require('express');
const router = express.Router();

const {
    apel,
    pisang,
    alpukat,
    kiwi,
    pepaya,
    jambuBiji,
    buahNaga,
    mangga,
    pir,
    labuKuning,
    melon,
    buahPlum,
    buahBit,
} = require('../handler/handler-buah');

router.get('/Apel', (req, res) => {
    res.send(apel);
});

router.get('/Pisang', (req, res) => {
    res.send(pisang);
});

router.get('/Alpukat', (req, res) => {
    res.send(alpukat);
});

router.get('/Kiwi', (req, res) => {
    res.send(kiwi);
});

router.get('/Pepaya', (req, res) => {
    res.send(pepaya);
});

router.get('/JambuBiji', (req, res) => {
    res.send(jambuBiji);
});

router.get('/BuahNaga', (req, res) => {
    res.send(buahNaga);
});

router.get('/Mangga', (req, res) => {
    res.send(mangga);
});

router.get('/Pir', (req, res) => {
    res.send(pir);
});

router.get('/LabuKuning', (req, res) => {
    res.send(labuKuning);
});

router.get('/Melon', (req, res) => {
    res.send(melon);
});

router.get('/BuahPlum', (req, res) => {
    res.send(buahPlum);
});

router.get('/BuahBit', (req, res) => {
    res.send(buahBit);
});

module.exports = router;
