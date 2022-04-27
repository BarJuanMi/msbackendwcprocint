/*
    Ruta: /api/pqrs
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { crearPQRS, obtenerPQRS, obtenerPQRSPorId, obtenerPQRSFiltradas, eliminarPQRS, actualizarPQRS } = require('../controllers/pqrsincidentes.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, obtenerPQRS);

router.get('/obtenerPQRSId/:id', validarJWT, obtenerPQRSPorId);

router.post('/crearPQRS', validarJWT, crearPQRS);

router.post('/obtenerPQRSFiltradas', validarJWT, obtenerPQRSFiltradas);

router.delete('/eliminarPQRS/:id', validarJWT, eliminarPQRS);

router.put('/actualizarPQRS/:id', validarJWT, actualizarPQRS);

module.exports = router;