const { response } = require('express');
const Prestamo = require('../models/prestamo.model');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getPrestamos = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 10 en adelante, recordar que le numeracion comienza en 0

    const [prestamos, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        Prestamo.find({}) //solo me muestra en el resutlado de la consulta las columnas
        .skip(desde)
        .populate('empleado', 'documento nombApellConca')
        .populate('usuario', 'nombre')
        .populate('usuarioActualizacion', 'nombre')
        .sort({ fechaCreacion: -1 })
        .limit(Number(process.env.LIMIT_QUERY_PRESTAMO)),

        //Promesa 2
        Prestamo.countDocuments()
    ]);

    res.json({
        status: true,
        prestamos,
        total
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const crearPrestamo = async(req, res = response) => {
    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        req.body.usuario = uid;

        const prestamoNew = new Prestamo({
            usuario: uid,
            ...req.body
        });

        prestamoNew.estado = 'COBRO PENDIENTE';
        prestamoNew.fechaCreacion = new Date();

        const prestamoRet = await prestamoNew.save();

        res.json({
            status: true,
            prestamoRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación de Prestamo - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const buscarPrestamoPorId = async(req, res = response) => {
    const idPrestamo = req.params.id;

    try {
        const prestamoRet = await Prestamo
            .findById(idPrestamo)
            .populate('usuario', 'nombre')
            .populate('empleado', 'documento nombApellConca')
            .populate('usuarioActualizacion', 'nombre');

        if (!prestamoRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el prestamo con ese id'
            });
        }

        res.json({
            status: true,
            prestamo: prestamoRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la busqueda particular del prestamo - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const actualizarPrestamo = async(req, res = response) => {
    const uid = req.uid;

    const idPrestamo = req.params.id;
    try {
        const resPrestamoDB = await Prestamo.findById(idPrestamo);

        if (!resPrestamoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el prestamo con ese id'
            });
        }

        req.body.usuarioActualizacion = uid;
        req.body.fechaActualizacion = '' + new Date();

        const { fechaCreacion, modelo, monto, observaciones, usuario, ...campos } = req.body;

        const prestamoActualizado = await Prestamo.findByIdAndUpdate(idPrestamo, campos, { new: true });

        res.json({
            status: true,
            prestamo: prestamoActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la inactivacion de Modelo - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const eliminarPrestamo = async(req, res = response) => {
    const idPrestamo = req.params.id;

    try {
        const resPretamoDB = await Prestamo.findById(idPrestamo);

        if (!resPretamoDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el prestamo con ese id'
            });
        }

        const prestamoEliminado = await Prestamo.findByIdAndDelete(idPrestamo);

        res.json({
            status: true,
            msg: 'Prestamo eliminado correctamente',
            prestamo: prestamoEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del Prestamo - Ver logs'
        });
    }
}

module.exports = {
    getPrestamos,
    crearPrestamo,
    buscarPrestamoPorId,
    actualizarPrestamo,
    eliminarPrestamo
}