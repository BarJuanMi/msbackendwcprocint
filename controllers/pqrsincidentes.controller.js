const { response } = require('express');
const PQRSIncidente = require('../models/pqrsincidente.model');
const Empleado = require('../models/empleado.model');
const Usuario = require('../models/usuario.model');
const TipoPQRS = require('../models/tipopqrs.model');
const Sede = require('../models/sede.model');
const { addHoursDate } = require('../helpers/formateadores');

/**
 * Operación para obtener todos los incidentes y pqrs usando el desde como 
 * condicion inical de busqueda hasta el final de la coleccion.
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno segun la peticion
 */
const obtenerPQRS = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 15 en adelante, recordar que le numeracion comienza en 0

    const [pqrsi, total] = await Promise.all([
        //Promesa 1
        //Los filtros de los campos a mostrar se controlan desde el modelo
        PQRSIncidente.find({}) //solo me muestra en el resutlado de la consulta las columnas
        .skip(desde)
        .populate('empleadoAsociado', 'documento nombApellConca')
        .populate('usuarioRegistro', 'nombre')
        .populate('usuarioAsignado', 'nombre')
        .populate('tipo', 'tipopqrsDesc')
        .populate('sede', 'nombre stylePre')
        .sort({ prioridad: 1, fechaRegistro: -1 })
        .limit(Number(process.env.LIMIT_QUERY_PQRS)),

        //Promesa 2
        PQRSIncidente.countDocuments()
    ]);

    res.json({
        status: true,
        pqrsi,
        total
    })
}

/**
 * Operación para obtener un PQRS o incidente particular usando el id
 * como llave de busqueda
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno segun la peticion
 * @returns 
 */
const obtenerPQRSPorId = async(req, res = response) => {
    const idPQRS = req.params.id;

    try {
        const pqrsRet = await PQRSIncidente.findById(idPQRS)
            .populate('empleadoAsociado', 'documento nombApellConca')
            .populate('usuarioRegistro', 'nombre')
            .populate('usuarioAsignado', 'nombre')
            .populate('tipo', 'tipopqrsDesc')
            .populate('sede', 'nombre')

        if (!pqrsRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el PQRS con ese id'
            });
        }

        res.json({
            status: true,
            pqrs: pqrsRet
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la busqueda particular del PQRS - Ver logs'
        })
    }
}

/**
 * Operación para crear un nuevo PQRS o incidente dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno sguen la peticion
 */
const crearPQRS = async(req, res = response) => {
    try {
        const { tipo, empleadoAsociado, ...campos } = req.body;
        const uid = req.uid;

        const pqrsNew = new PQRSIncidente({
            usuarioRegistro: uid,
            ...req.body
        });
        pqrsNew.fechaOcurrencia = req.body.fechaOcurrencia
        pqrsNew.usuarioAsignado = tipo.split('-')[1];
        pqrsNew.tipo = tipo.split('-')[0];

        const pqrsRet = await pqrsNew.save();

        res.json({
            status: true,
            pqrsRet
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación de PQRS - Ver logs'
        });
    }
}

/**
 * Operación para obtener todos los incidentes y pqrs usando los filtros 
 * que llegan en la peticion
 * @param {*} req 
 * @param {*} res 
 */
const obtenerPQRSFiltradas = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0; // comienza a paginar desde el registro 15 en adelante, recordar que le numeracion comienza en 0

    try {

        const tipoPQRSFil = await TipoPQRS.findById(req.body.tipo);
        const sedeFil = await Sede.findById(req.body.sede);
        const empleAsociaFil = await Empleado.findById(req.body.empleadoAsociado);
        const usuaRegisFil = await Usuario.findById(req.body.usuarioRegistrado);
        const usuaAsigFil = await Usuario.findById(req.body.usuarioAsignado);

        let query = {};

        tipoPQRSFil === null ? query = {...query } : query = {...query, tipo: tipoPQRSFil };
        sedeFil === null ? query = {...query } : query = {...query, sede: sedeFil };
        empleAsociaFil === null ? query = {...query } : query = {...query, empleadoAsociado: empleAsociaFil };
        usuaRegisFil === null ? query = {...query } : query = {...query, usuarioRegistro: usuaRegisFil };
        usuaAsigFil === null ? query = {...query } : query = {...query, usuarioAsignado: usuaAsigFil };

        const [pqrsi, total] = await Promise.all([

            PQRSIncidente.find(query)
            .skip(desde)
            .populate('empleadoAsociado', 'documento nombApellConca')
            .populate('usuarioRegistro', 'nombre')
            .populate('usuarioAsignado', 'nombre')
            .populate('tipo', 'tipopqrsDesc')
            .populate('sede', 'nombre')
            .sort({ prioridad: 1, fechaRegistro: -1 })
            .limit(Number(process.env.LIMIT_QUERY_PQRS)),

            PQRSIncidente.countDocuments(query)
        ]);
        res.json({
            status: true,
            pqrsi,
            total
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la consulta de PQRS filtradas - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const eliminarPQRS = async(req, res = response) => {
    const idPQRS = req.params.id;

    try {
        const resPQRSDB = await PQRSIncidente.findById(idPQRS);

        if (!resPQRSDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el prestamo con ese id'
            });
        }

        const pqrsEliminado = await PQRSIncidente.findByIdAndDelete(idPQRS);

        res.json({
            status: true,
            msg: 'PQRS eliminado correctamente',
            prestamo: pqrsEliminado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del PQRS - Ver logs'
        });
    }
}

const actualizarPQRS = async(req, res = response) => {
    const uid = req.uid;

    try {
        const idPQRS = req.params.id;

        const resPQRSDB = await PQRSIncidente.findById(idPQRS);

        if (!resPQRSDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de servicio de lavanderia con ese id'
            });
        }

        let regActuaPQRS = {
            estado: req.body.estado,
            prioridad: req.body.prioridad,
        }

        if (resPQRSDB.respuestaAsociadaOne === '-') {
            regActuaPQRS = {...regActuaPQRS, respuestaAsociadaOne: req.body.respuesta };
        } else if (resPQRSDB.respuestaAsociadaTwo === '-') {
            regActuaPQRS = {...regActuaPQRS, respuestaAsociadaTwo: req.body.respuesta };
        }

        const regPQRSActualizado = await PQRSIncidente.findByIdAndUpdate(idPQRS, regActuaPQRS, { new: true });

        res.json({
            status: true,
            retiro: regPQRSActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la actualización del servicio de lavanderia - Ver logs'
        });
    }
}

module.exports = {
    obtenerPQRS,
    obtenerPQRSPorId,
    crearPQRS,
    obtenerPQRSFiltradas,
    eliminarPQRS,
    actualizarPQRS
}