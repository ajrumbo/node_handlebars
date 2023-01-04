import mongoose, { Schema } from "mongoose";
import slugs from "slug";

const categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: String
}, {
    timestamps: false,
    versionKey: false
});

categoriaSchema.pre('save', function (next) {
    const slug = slugs(this.nombre);
    this.slug = `${slug}`;
    next();
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;