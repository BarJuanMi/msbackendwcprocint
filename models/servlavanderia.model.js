const { Schema, model } = require('mongoose');

var servlavanderiaSchema = new Schema({
    cantidadColchas: { type: Number, required: true, default: 0 },
    sede: { type: Schema.Types.ObjectId, ref: 'Sede' },
    estado: { type: String, required: false, default: 'EN LA LAVANDERIA' },
    fechaRegistro: { type: Date, default: Date.now },
    usuarioRegistro: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fechaSalidaColchas: { type: Date, required: false },
    obsSalidaColchas: { type: String, required: false, default: 'N/A' },
    fechaRecibeColchas: { type: Date, required: false },
    obsRecibeColchas: { type: String, required: false, default: 'N/A' },
    usuarioRecibeColchas: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    recibeSatisfaccion: { type: Boolean, default: false },
    img: { type: String, required: false }
}, {
    collection: 'servlavanderias'
});

module.exports = model('Servlavanderia', servlavanderiaSchema);