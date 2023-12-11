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

router.get('/bijiAprikot', (req, res) => {
    res.send(bijiAprikot);
});

router.get('/bijiLabu', (req, res) => {
    res.send(bijiLabu);
});

router.get('/hazelnut', (req, res) => {
    res.send(hazelnut);
});

router.get('/kacangTanah', (req, res) => {
    res.send(kacangTanah);
});

router.get('/kacangHijau', (req, res) => {
    res.send(kacangHijau);
});

router.get('/kacangHitam', (req, res) => {
    res.send(kacangHitam);
});

router.get('/kacangKedelai', (req, res) => {
    res.send(kacangKedelai);
});

router.get('/kacangKoro', (req, res) => {
    res.send(kacangKoro);
});

router.get('/kacangMede', (req, res) => {
    res.send(kacangMede);
});

router.get('/kacangMerah', (req, res) => {
    res.send(kacangMerah);
});

router.get('/kacangPecan', (req, res) => {
    res.send(kacangPecan);
});

router.get('/kacangPinus', (req, res) => {
    res.send(kacangPinus);
});

router.get('/kacangPolong', (req, res) => {
    res.send(kacangPolong);
});

router.get('/kacangTunggak', (req, res) => {
    res.send(kacangTunggak);
});

router.get('/kacangKenari', (req, res) => {
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
