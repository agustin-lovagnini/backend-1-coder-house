import { Router } from "express";
import Product from "../models/Product.js";
import Cart from "../models/cart.js";

const router = Router();

// 🛍️ LISTADO
router.get("/products", async (req, res) => {
    try {
        const { page = 1 } = req.query;

        const result = await Product.paginate({}, {
            page,
            limit: 10
        });

        res.render("home", {
            products: result.docs.map(p => p.toObject()),
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        });

    } catch (error) {
        res.send("Error al cargar productos");
    }
});

// 🔍 DETALLE
router.get("/products/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);

        res.render("productDetail", {
            product: product.toObject()
        });

    } catch (error) {
        res.send("Error al cargar producto");
    }
});

// 🛒 CARRITO
router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid)
            .populate("products.product");

        res.render("cart", {
            cart: cart.toObject()
        });

    } catch (error) {
        res.send("Error al cargar carrito");
    }
});

export default router;