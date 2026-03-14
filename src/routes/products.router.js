import { Router } from "express"; // importo el Router de express para crear rutas, mini servidores
import fs from "fs"; // trae el módulo fs de Node.js. El módulo fs (file system) proporciona una API para interactuar con el sistema de archivos.

const router = Router(); // isto crea el router. Después ese router lo conectás en app.js.

const PRODUCTS_PATH = "./src/data/products.json"; //  esto guardamos la dirección del archivo donde están los productos.

//! funciones para leer y escribir productos en el archivo JSON
const readProducts = () => {
    if (!fs.existsSync(PRODUCTS_PATH)) return [];
    const data = fs.readFileSync(PRODUCTS_PATH, "utf-8");
    return JSON.parse(data || "[]");
};

//! funcion para guardar los productos en el archivo JSON. Recibe un array de productos y lo guarda en el archivo.
const writeProducts = (products) => {
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));
};

//! Obtener todos los productos
router.get("/", (req, res) => {
    const products = readProducts();
    res.json(products);
});

//! Obtener producto por ID
router.get("/:id", (req, res) => {
    const products = readProducts();
    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
});

//! Crear producto
router.post("/", (req, res) => {
    const products = readProducts();

    const nextId =
        products.length > 0
            ? products[products.length - 1].id + 1
            : 1;

    const newProduct = {
        id: nextId,
        ...req.body
    };

    products.push(newProduct);

    writeProducts(products);

    res.status(201).json(newProduct);
});

//! Eliminar producto
router.delete("/:id", (req, res) => {

    const products = readProducts();
    const id = parseInt(req.params.id);

    const filteredProducts = products.filter(p => p.id !== id);

    writeProducts(filteredProducts);

    res.json({ message: "Producto eliminado" });

});

export default router;