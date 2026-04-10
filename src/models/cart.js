import mongoose from "mongoose";

//! Esquema de carrito
const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema); //* Si ya existe el modelo "Cart", lo usa. Si no, lo crea con el esquema cartSchema.

export default Cart;
