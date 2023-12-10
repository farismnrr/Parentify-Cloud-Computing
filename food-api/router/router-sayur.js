const express = require('express');
const router = express.Router();
const {
    selada,
    akarTeratai,
    arugula,
    asparagus,
    daunBawang,
    pakcoy,
    brokoli,
    daunKelor,
    buncis,
    bayam,
    wortel,
    kacangPanjang,
    kangkung,
    kol,
    kembangKol,
    labuPutih,
    labuSiam,
    oyong,
    paprika,
    sawiHijau,
    kentang,
    seledri,
    terong,
    mentimun,
    tomat,
    jamurTiram,
    jamurShiitake,
    jamurEnoki,
    jamurChampignon,
} = require('../handler/handler-sayur');

router.get('/selada', (req, res) => {
    res.send(selada);
});

router.get('/akar_teratai', (req, res) => {
    res.send(akarTeratai);
});

router.get('/arugula', (req, res) => {
    res.send(arugula);
});

router.get('/asparagus', (req, res) => {
    res.send(asparagus);
});

router.get('/daun_bawang', (req, res) => {
    res.send(daunBawang);
});

router.get('/pakcoy', (req, res) => {
    res.send(pakcoy);
});

router.get('/brokoli', (req, res) => {
    res.send(brokoli);
});

router.get('/daun_kelor', (req, res) => {
    res.send(daunKelor);
});

router.get('/buncis', (req, res) => {
    res.send(buncis);
});

router.get('/bayam', (req, res) => {
    res.send(bayam);
});

router.get('/wortel', (req, res) => {
    res.send(wortel);
});

router.get('/kacang_panjang', (req, res) => {
    res.send(kacangPanjang);
});

router.get('/kangkung', (req, res) => {
    res.send(kangkung);
});

router.get('/kol', (req, res) => {
    res.send(kol);
});

router.get('/kembang_kol', (req, res) => {
    res.send(kembangKol);
});

router.get('/labu_putih', (req, res) => {
    res.send(labuPutih);
});

router.get('/labu_siam', (req, res) => {
    res.send(labuSiam);
});

router.get('/oyong', (req, res) => {
    res.send(oyong);
});

router.get('/paprika', (req, res) => {
    res.send(paprika);
});

router.get('/sawi_hijau', (req, res) => {
    res.send(sawiHijau);
});

router.get('/kentang', (req, res) => {
    res.send(kentang);
});

router.get('/seledri', (req, res) => {
    res.send(seledri);
});

router.get('/terong', (req, res) => {
    res.send(terong);
});

router.get('/mentimun', (req, res) => {
    res.send(mentimun);
});

router.get('/tomat', (req, res) => {
    res.send(tomat);
});

router.get('/jamur_tiram', (req, res) => {
    res.send(jamurTiram);
});

router.get('/jamur_shiitake', (req, res) => {
    res.send(jamurShiitake);
});

router.get('/jamur_enoki', (req, res) => {
    res.send(jamurEnoki);
});

router.get('/jamur_champignon', (req, res) => {
    res.send(jamurChampignon);
});

module.exports = router;
