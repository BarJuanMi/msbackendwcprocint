const { Schema, model } = require('mongoose');

const SedeSchema = new Schema({
    nombre: { type: String, required: true },
    telefonoPrinc: { type: String, required: true },
    telefonoSec: { type: String, required: false, default: "No especifica" },
    //servsInternet: [Schema.Types.Serinternet],
    direccion: { type: String, required: true },
    ciudad: { type: Schema.Types.ObjectId, ref: 'Ciudad' },
    localidad: { type: Schema.Types.ObjectId, ref: 'Localidad' },
    stylePre: { type: String, required: false, default: ".text-primary" },
}, {
    collection: 'sedes'
});

module.exports = model('Sede', SedeSchema);