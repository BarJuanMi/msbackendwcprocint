const { response } = require('express');
const Vacunado = require('../models/vacunado.model');
const Empleado = require('../models/empleado.model');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getVacunados = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const [vacunados, total] = await Promise.all([
        Vacunado.find({})
        .skip(desde)
        .populate('empleado', 'documento nombApellConca')
        .populate('usuario', 'nombre')
        .limit(Number(process.env.LIMIT_QUERY_VACUNADOS)),

        //Promesa 2
        Vacunado.countDocuments()
    ]);

    res.json({
        status: true,
        vacunados,
        total
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const crearRegVacunado = async(req, res = response) => {
    try {
        const uid = req.uid;
        const vacunadoRegNew = new Vacunado({
            usuario: uid,
            ...req.body
        });

        const empleadoRet = await Empleado.findById(req.body.empleado);
        const resVacuEmpleDB = await Vacunado.find({ empleado: empleadoRet });

        if (resVacuEmpleDB[0]) {
            return res.status(400).json({
                status: false,
                msg: 'Ya existe un registro de vacunación para este empleado.'
            });

        } else {
            const vacunadoRegRet = await vacunadoRegNew.save();

            res.json({
                status: true,
                vacunadoRegRet
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la creación del registro de vacunado - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const eliminarRegVacunado = async(req, res = response) => {
    const idRegVacunado = req.params.id;
    try {
        const resRegVacDB = await Vacunado.findById(idRegVacunado);

        if (!resRegVacDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de vacunado con ese id'
            });
        }

        const regVacEliminado = await Vacunado.findByIdAndDelete(idRegVacunado);

        res.json({
            status: true,
            msg: 'Registro de vacunado eliminado correctamente',
            vacunado: regVacEliminado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'Error durante la eliminacion del Registro de vacunado - Ver logs'
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const crearRegDosis = async(req, res = response) => {

    console.log(req.body);

    const idRegVacunado = req.params.id;
    let aprueba = false;

    try {
        const resRegVacDB = await Vacunado.findById(idRegVacunado);
        if (!resRegVacDB) {
            return res.status(400).json({
                status: false,
                msg: 'No existe el registro de vacunado con ese id'
            });
        }

        const fechaDosis = req.body.fechaDosis;
        const numeroDosis = req.body.numDosis;
        const farmaDosis = req.body.farmaDosis;
        var regVacActualizado = '';

        switch (numeroDosis) {
            case '2':
                if (!resRegVacDB.farmaSecDosis) {
                    regVacActualizado = await Vacunado.findByIdAndUpdate(idRegVacunado, { fechaSecDosis: fechaDosis, farmaSecDosis: farmaDosis }, { new: true });
                    aprueba = true;
                }
                break;

            case '3':
                if (!resRegVacDB.farmaTerDosis) {
                    regVacActualizado = await Vacunado.findByIdAndUpdate(idRegVacunado, { fechaTerDosis: fechaDosis, farmaTerDosis: farmaDosis }, { new: true });
                    aprueba = true;
                }
                break;

            case '4':
                if (!resRegVacDB.farmaCuarDosis) {
                    regVacActualizado = await Vacunado.findByIdAndUpdate(idRegVacunado, { fechaCuarDosis: fechaDosis, farmaCuarDosis: farmaDosis }, { new: true });
                    aprueba = true;
                }
                break;
        }

        if (aprueba) {
            res.json({
                status: true,
                vacunado: regVacActualizado,
                msg: 'Creacion del registro de nueva dosis de forma satisfactoria.'
            });
        } else {
            res.json({
                status: false,
                vacunado: regVacActualizado,
                msg: 'Error, Ya existia un registro para ese número de dosis.'
            });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: true,
            msg: 'Error durante la actualización del registro de vacunado - Ver logs'
        });
    }
}


module.exports = {
    getVacunados,
    crearRegVacunado,
    eliminarRegVacunado,
    crearRegDosis
}