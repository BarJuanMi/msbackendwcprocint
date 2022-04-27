const { Schema, model } = require('mongoose');

var pqrsincidenteSchema = new Schema({
    detallePrimario: { type: String, required: [true, 'El detalle es necesario'] },
    prioridad: { type: String, required: true, default: 'NORMAL' },
    estado: { type: String, required: true, default: 'ABIERTO' },
    evidencia: { type: Boolean, default: false },
    fechaOcurrencia: { type: String, required: false },
    fechaRegistro: { type: Date, default: Date.now },
    sede: { type: Schema.Types.ObjectId, ref: 'Sede' },
    empleadoAsociado: { type: Schema.Types.ObjectId, required: false, ref: 'Empleado' },
    tipo: { type: Schema.Types.ObjectId, ref: 'TipoPQRS' },
    usuarioRegistro: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    usuarioAsignado: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    respuestaAsociadaOne: { type: String, required: false, default: '-' },
    respuestaAsociadaTwo: { type: String, required: false, default: '-' },
    img: { type: String, required: false }
}, {
    collection: 'pqrsincidentes'
});

module.exports = model('PQRSIncidente', pqrsincidenteSchema);