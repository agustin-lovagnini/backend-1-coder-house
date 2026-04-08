import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;