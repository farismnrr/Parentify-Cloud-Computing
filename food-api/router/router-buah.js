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

router.get('/jambu-biji', (req, res) => {
    res.send(jambuBiji);
});

router.get('/buah-naga', (req, res) => {
    res.send(buahNaga);
});

router.get('/mangga', (req, res) => {
    res.send(mangga);
});

router.get('/pir', (req, res) => {
    res.send(pir);
});

router.get('/labu-kuning', (req, res) => {
    res.send(labuKuning);
});

router.get('/melon', (req, res) => {
    res.send(melon);
});

router.get('/buah-plum', (req, res) => {
    res.send(buahPlum);
});

router.get('/buah-bit', (req, res) => {
    res.send(buahBit);
});

module.exports = router;
