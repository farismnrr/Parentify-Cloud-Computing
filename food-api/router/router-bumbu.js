const express = require('express');
const router = express.Router();

const {
    jahe,
    kunyit,
    kayuManis,
    ketumbar,
    daunSalam,
    daunJeruk,
    oregano,
    bawangBombay,
    bawangPutih,
    bawangMerah,
} = require('../handler/handler-bumbu');

router.get('/jahe', (req, res) => {
    res.send(jahe);
});

router.get('/kunyit', (req, res) => {
    res.send(kunyit);
});

router.get('/kayuManis', (req, res) => {
    res.send(kayuManis);
});

router.get('/ketumbar', (req, res) => {
    res.send(ketumbar);
});

router.get('/daunSalam', (req, res) => {
    res.send(daunSalam);
});

router.get('/daunJeruk', (req, res) => {
    res.send(daunJeruk);
});

router.get('/oregano', (req, res) => {
    res.send(oregano);
});

router.get('/bawangBombay', (req, res) => {
    res.send(bawangBombay);
});

router.get('/bawangPutih', (req, res) => {
    res.send(bawangPutih);
});

router.get('/bawangMerah', (req, res) => {
    res.send(bawangMerah);
});

module.exports = router;
