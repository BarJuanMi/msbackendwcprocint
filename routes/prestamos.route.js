/*
    Ruta: /api/prestamos
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getPrestamos, crearPrestamo, buscarPrestamoPorId, actualizarPrestamo, eliminarPrestamo } = require('../controllers/prestamos.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getPrestamos);

router.post('/crearPrestamo', validarJWT, crearPrestamo);

router.get('/buscarPrestamoId/:id', validarJWT, buscarPrestamoPorId);

router.put('/actualizarPrestamo/:id', validarJWT, actualizarPrestamo);

router.delete('/eliminarPrestamo/:id', validarJWT, eliminarPrestamo);

module.exports = router;