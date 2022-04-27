var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vacunadoSchema = new Schema({
    empleado: { type: Schema.Types.ObjectId, ref: 'Empleado' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    farmaPriDosis: { type: String, required: false },
    farmaSecDosis: { type: String, required: false },
    farmaTerDosis: { type: String, required: false },
    farmaCuarDosis: { type: String, required: false },
    fechaPriDosis: { type: Date, required: false},
    fechaSecDosis: { type: Date, required: false },
    fechaTerDosis: { type: Date, required: false },
    fechaCuarDosis: { type: Date, required: false },
    regulador: { type: String, required: true },
    img: { type: String, required: false }
}, {
    collection: 'vacunados'
});

module.exports = mongoose.model('Vacunado', vacunadoSchema);