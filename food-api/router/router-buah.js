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

router.get('/apel', (req, res) => {
    res.send(apel);
});

router.get('/pisang', (req, res) => {
    res.send(pisang);
});

router.get('/alpukat', (req, res) => {
    res.send(alpukat);
});

router.get('/kiwi', (req, res) => {
    res.send(kiwi);
});

router.get('/pepaya', (req, res) => {
    res.send(pepaya);
});

router.get('/jambuBiji', (req, res) => {
    res.send(jambuBiji);
});

router.get('/buahNaga', (req, res) => {
    res.send(buahNaga);
});

router.get('/mangga', (req, res) => {
    res.send(mangga);
});

router.get('/pir', (req, res) => {
    res.send(pir);
});

router.get('/labuKuning', (req, res) => {
    res.send(labuKuning);
});

router.get('/melon', (req, res) => {
    res.send(melon);
});

router.get('/buahPlum', (req, res) => {
    res.send(buahPlum);
});

router.get('/buahBit', (req, res) => {
    res.send(buahBit);
});

module.exports = router;
