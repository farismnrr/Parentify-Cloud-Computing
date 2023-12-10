const express = require('express');
const router = express.Router();

const {
    Jahe,
    Kunyit,
    KayuManis,
    Ketumbar,
    DaunSalam,
    DaunJeruk,
    Oregano,
    BawangBombay,
    BawangPutih,
    BawangMerah,
} = require('../handler/handler-bumbu');

router.get('/jahe', (req, res) => {
    res.send(Jahe);
});

router.get('/kunyit', (req, res) => {
    res.send(Kunyit);
});

router.get('/kayu_manis', (req, res) => {
    res.send(KayuManis);
});

router.get('/ketumbar', (req, res) => {
    res.send(Ketumbar);
});

router.get('/daun_salam', (req, res) => {
    res.send(DaunSalam);
});

router.get('/daun_jeruk', (req, res) => {
    res.send(DaunJeruk);
});

router.get('/oregano', (req, res) => {
    res.send(Oregano);
});

router.get('/bawang_bombay', (req, res) => {
    res.send(BawangBombay);
});

router.get('/bawang_putih', (req, res) => {
    res.send(BawangPutih);
});

router.get('/bawang_merah', (req, res) => {
    res.send(BawangMerah);
});

module.exports = router;
