const { Schema, model } = require('mongoose');

const TipoPQRSSchema = new Schema({
    tipopqrsId: { type: String },
    tipopqrsDesc: { type: String },
    usuarioAsig: { type: Schema.Types.ObjectId, ref: 'Usuario' },
}, {
    collection: 'tipopqrs'
});

module.exports = model('TipoPQRS', TipoPQRSSchema);