import mongoose, { Schema } from "mongoose";


const productoFotoSchema = new Schema({
    producto_id: {
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    },
    nombre: {
        type: String,
        unique: true,
        trim: true
    }
}, {
    timestamps: false,
    versionKey: false
});

const ProductoFoto = mongoose.model('ProductoFoto', productoFotoSchema);

export default ProductoFoto;