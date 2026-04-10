import { Router } from "express";
import Product from "../models/product.js"; //* consulto producto de MD
import Cart from "../models/cart.js"; //* consulto carrito de MD

const router = Router();

//! Función para obtener o crear un carrito depende si ya esta armado
const getOrCreateCart = async () => {
    let cart = await Cart.findOne(); //* busco un carrito existente UNICO

    if (!cart) {
        cart = await Cart.create({ products: [] });
    }

    return cart;
};

//! Listado de productos con paginación, ordenamiento y filtrado
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, query } = req.query;
        const cart = await getOrCreateCart();
        let filter = {};

        if (query) {
            if (query === "true" || query === "false") {
                filter.stock = query === "true" ? { $gt: 0 } : 0;
            } else {
                filter.category = query;
            }
        }

        const result = await Product.paginate(filter, {
            page: Number(page),
            limit: Number(limit),
            sort:
                sort === "asc"
                    ? { price: 1 }
                    : sort === "desc"
                    ? { price: -1 }
                    : {}
        });

        const queryParts = [];

        if (limit) queryParts.push(`limit=${limit}`);
        if (query) queryParts.push(`query=${query}`);
        if (sort) queryParts.push(`sort=${sort}`);

        const extraQuery = queryParts.length ? `&${queryParts.join("&")}` : "";

        res.render("products", {
            products: result.docs.map((p) => p.toObject()),
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            cartId: cart._id.toString(),
            limit,
            sort,
            query,
            extraQuery
        });

    } catch (error) {
        res.send("Error al cargar productos");
    }
});

// Detalle
router.get("/products/:pid", async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        const cart = await getOrCreateCart();

        res.render("productDetail", {
            product: product.toObject(),
            cartId: cart._id.toString()
        });

    } catch (error) {
        res.send("Error al cargar producto");
    }
});

// Carrito
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
