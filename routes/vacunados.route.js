/*
    Ruta: /api/vacunas
*/
const { Router } = require('express');
const { getVacunados, crearRegVacunado, eliminarRegVacunado, crearRegDosis } = require('../controllers/vacunados.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getVacunados);

router.post('/crearRegVacunado', validarJWT, crearRegVacunado);

router.put('/crearRegDosis/:id', validarJWT, crearRegDosis);

router.delete('/eliminarRegVacunado/:id', validarJWT, eliminarRegVacunado);

module.exports = router;