import { Router } from "express"; // importo el Router de express para crear rutas, mini servidores
import fs from "fs"; 

const router = Router(); // esto crea el router. Después ese router lo conectás en app.js.

const CARTS_PATH = "./src/data/carts.json"; // esto guardamos la dirección del archivo donde están los carritos .JSON.
const PRODUCTS_PATH = "./src/data/products.json"; // esto guardamos la dirección del archivo donde están los productos .JSON.


//! funciones para leer y escribir carritos en el archivo JSON
const readCarts = () => {
    if (!fs.existsSync(CARTS_PATH)) return [];
    const data = fs.readFileSync(CARTS_PATH, "utf-8");
    return JSON.parse(data || "[]");
};

//! funcion para guardar los carritos en el archivo JSON. Recibe un array de carritos y lo guarda en el archivo.
const writeCarts = (carts) => {
    fs.writeFileSync(CARTS_PATH, JSON.stringify(carts, null, 2));
};

//! funciones para leer productos en el archivo JSON
const readProducts = () => {
    if (!fs.existsSync(PRODUCTS_PATH)) return [];
    const data = fs.readFileSync(PRODUCTS_PATH, "utf-8");
    return JSON.parse(data || "[]");
};

// ! Obtener todos los carritos 
router.post("/", (req, res) => {

    const carts = readCarts();// leemos los carritos existentes

    const nextId =
        carts.length > 0
            ? carts[carts.length - 1].id + 1
            : 1;

    const newCart = {
        id: nextId,
        products: []
    };

    carts.push(newCart);

    writeCarts(carts);

    res.status(201).json(newCart);

});

// Obtener productos del carrito
router.get("/:cid", (req, res) => {

    const carts = readCarts();
    const id = parseInt(req.params.cid);

    const cart = carts.find(c => c.id === id);

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart.products);

});

// Agregar producto al carrito
router.post("/:cid/product/:pid", (req, res) => {

    const carts = readCarts();
    const products = readProducts();

    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const cart = carts.find(c => c.id === cartId);

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productExists = products.find(p => p.id === productId);

    if (!productExists) {
        return res.status(404).json({ error: "Producto no existe" });
    }

    const productInCart = cart.products.find(p => p.product === productId);

    if (productInCart) {
        productInCart.quantity += 1;
    } else {
        cart.products.push({
            product: productId,
            quantity: 1
        });
    }

    writeCarts(carts);

    res.json(cart);

});

export default router;