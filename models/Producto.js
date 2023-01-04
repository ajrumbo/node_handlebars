import mongoose, { Schema } from "mongoose";
import slugs from "slug";

const productoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: String,
    descripcion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    categoria_id: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    }
}, {
    timestamps: false,
    versionKey: false
});

productoSchema.pre('save', function (next) {
    const slug = slugs(this.nombre);
    this.slug = `${slug}`;
    next();
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;