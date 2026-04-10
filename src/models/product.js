import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; //

//! Esquema de producto
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    type: String,
    stock: Number,
    code: String
});

productSchema.plugin(mongoosePaginate); 

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);//* Si ya existe el modelo "Product", lo usa. Si no, lo crea con el esquema productSchema.

export default Product;