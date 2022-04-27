/*
    Ruta: /api/lavanderias
*/
const { Router } = require('express');
const { crearRegServLavanderia, getServLavanderias, buscarServLavanderiaPorId, actualizarRegServLavanderia, eliminarRegServLavanderia } = require('../controllers/servlavanderias.controller');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getServLavanderias);

router.post('/crearRegServLavanderia', validarJWT, crearRegServLavanderia);

router.get('/buscarServLavanderiaId/:id', validarJWT, buscarServLavanderiaPorId);

router.put('/actualizarServLavanderia/:id', validarJWT, actualizarRegServLavanderia);

router.delete('/eliminarServLavanderia/:id', validarJWT, eliminarRegServLavanderia);

module.exports = router;