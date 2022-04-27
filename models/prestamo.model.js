var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var prestamoSchema = new Schema({
    monto: { type: Number, default: 0, required: [true, 'El monto es necesario'] },
    empleado: { type: Schema.Types.ObjectId, ref: 'Empleado' },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    estado: { type: String, required: [true, 'El estado es necesario'] },
    fechaCreacion: { type: Date, required: [true, 'La fecha de prestamo es necesaria'] },
    observaciones: { type: String, required: false },
    fechaActualizacion: { type: Date, required: false },
    usuarioActualizacion: { type: Schema.Types.ObjectId, ref: 'Usuario' },
}, {
    collection: 'prestamos'
});

module.exports = mongoose.model('Prestamo', prestamoSchema);