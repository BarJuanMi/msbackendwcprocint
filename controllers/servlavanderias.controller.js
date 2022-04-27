const { response } = require('express');
const ServLavanderia = require('../models/servlavanderia.model');
const Sede = require('../models/sede.model');
const { addHoursDate } = require('../helpers/formateadores');

/**
 * Operación para obtener todos los aspirantes usando el desde como 
 * condicion inical de busqueda hasta el final de la coleccion.
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const getServLavanderias = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;
    const [servlavanderias, total] = await Promise.all([

        ServLavanderia.find({})
        .skip(desde)
        .populate('usuarioRegistro', 'nombre')
        .populate('sede', 'nombre')
        .sort({ fechaRegistro: -1 })
        .limit(Number(process.env.LIMIT_QUERY_SERVLAVAN)),

        ServLavanderia.countDocuments()
    ]);

    res.json({
        status: true,
        servlavanderias,
        total
    })
}

/**
 * Operación para crear un nuevo registro de lavanderia dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const crearRegServLavanderia = async(req, res = response) => {
    try {
        const uid = req.uid; //Saca el uid (identificador del usuario dentro del token de la peticion)
        const servLavanderiaNew = new ServLavanderia({
            usuarioRegistro: uid,
            ...req.body
        });

        servLavanderiaNew.fechaSalidaColchas = addHoursDate(req.body.fechaSalidaColchas);

        const servLavanderiaRet = await servLavanderiaNew.save();

        res.json({
            status: true,
            servLavanderiaRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la creación del registro servicio de lavanderia - Ver logs'
        });
    }
}

/**
 * Operación para buscar un nuevo registro individual de lavanderia dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const buscarServLavanderiaPorId = async(req, res = response) => {
    const idServLavan = req.params.id;

    try {
        const servLavanRet = await ServLavanderia
            .findById(idServLavan)
            .populate('usuarioRegistro', 'nombre')
            .populate('sede', 'nombre')

        if (!servLavanRet) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el servicio de lavanderia con ese id'
            });
        }

        res.json({
            status: true,
            servLavan: servLavanRet
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la busqueda particular del servicio de lavanderia - Ver logs'
        });
    }
}

/**
 * Operación para actualizar el registro de lavanderia dentro del sistema
 * @param {*} req Objeto con el payload para la peticion
 * @param {*} res Objeto con la data de retorno seguen la peticion
 */
const actualizarRegServLavanderia = async(req, res = response) => {
    console.log(req.body);

    const uid = req.uid;

    try {
        const idRegServLavan = req.params.id;

        const resRegServLavanDB = await ServLavanderia.findById(idRegServLavan);

        if (!resRegServLavanDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de servicio de lavanderia con ese id'
            });
        }

        if (req.body.recibeSatisfaccion === 'SI') {
            req.body.recibeSatisfaccion = true;
        } else {
            req.body.recibeSatisfaccion = false;
        }

        if (req.body.obsEntregaColchas === '') {
            req.body.obsEntregaColchas = 'N/A';
        }

        const regAActualizar = {
            fechaRecibeColchas: req.body.fechaRecibeColchas,
            recibeSatisfaccion: req.body.recibeSatisfaccion,
            obsRecibeColchas: req.body.obsRecibeColchas,
            estado: 'ENTREGADO A SEDE',
            usuarioRecibeColchas: uid
        };

        const regServLavanActualizado = await ServLavanderia.findByIdAndUpdate(idRegServLavan, regAActualizar, { new: true });

        res.json({
            status: true,
            retiro: regServLavanActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la actualización del servicio de lavanderia - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const eliminarRegServLavanderia = async(req, res = response) => {
    const uid = req.uid;

    try {
        const idRegServLavan = req.params.id;

        const resServLavanDB = await ServLavanderia.findById(idRegServLavan);

        if (!resServLavanDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de servicio de lavanderia con ese id'
            });
        }

        const servLavanEliminado = await ServLavanderia.findByIdAndDelete(idRegServLavan);

        res.json({
            status: true,
            msg: 'Registro eliminado correctamente',
            retiro: servLavanEliminado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminación del servicio de lavanderia - Ver logs'
        });
    }

}


module.exports = {
    crearRegServLavanderia,
    getServLavanderias,
    buscarServLavanderiaPorId,
    actualizarRegServLavanderia,
    eliminarRegServLavanderia
}