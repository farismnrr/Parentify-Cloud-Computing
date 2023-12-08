const express = require('express');
const router = express.Router();
const {
    almond,
    bijiAprikot,
    bijiLabu,
    hazelnut,
    kacangTanah,
    kacangHijau,
    kacangHitam,
    kacangKedelai,
    kacangKoro,
    kacangMede,
    kacangMerah,
    kacangPecan,
    kacangPinus,
    kacangPolong,
    kacangTunggak,
    kacangKenari,
    kuaci,
    macadamia,
    pistacio,
    tauge,
    edamame,
} = require('../handler/handler-kacang');

router.get('/almond', (req, res) => {
    res.send(almond);
});

router.get('/biji-aprikot', (req, res) => {
    res.send(bijiAprikot);
});

router.get('/biji-labu', (req, res) => {
    res.send(bijiLabu);
});

router.get('/hazelnut', (req, res) => {
    res.send(hazelnut);
});

router.get('/kacang-tanah', (req, res) => {
    res.send(kacangTanah);
});

router.get('/kacang-hijau', (req, res) => {
    res.send(kacangHijau);
});

router.get('/kacang-hitam', (req, res) => {
    res.send(kacangHitam);
});

router.get('/kacang-kedelai', (req, res) => {
    res.send(kacangKedelai);
});

router.get('/kacang-koro', (req, res) => {
    res.send(kacangKoro);
});

router.get('/kacang-mede', (req, res) => {
    res.send(kacangMede);
});

router.get('/kacang-merah', (req, res) => {
    res.send(kacangMerah);
});

router.get('/kacang-pecan', (req, res) => {
    res.send(kacangPecan);
});

router.get('/kacang-pinus', (req, res) => {
    res.send(kacangPinus);
});

router.get('/kacang-Polong', (req, res) => {
    res.send(kacangPolong);
});

router.get('/kacang-tunggak', (req, res) => {
    res.send(kacangTunggak);
});

router.get('/kacang-kenari', (req, res) => {
    res.send(kacangKenari);
});

router.get('/kuaci', (req, res) => {
    res.send(kuaci);
});

router.get('/macadamia', (req, res) => {
    res.send(macadamia);
});

router.get('/pistacio', (req, res) => {
    res.send(pistacio);
});

router.get('/tauge', (req, res) => {
    res.send(tauge);
});

router.get('/edamame', (req, res) => {
    res.send(edamame);
});

module.exports = router;
