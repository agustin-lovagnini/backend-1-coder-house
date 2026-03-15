import { Router } from "express"; // importo el Router de express para crear rutas
import fs from "fs"; // importo el módulo fs para trabajar con el sistema de archivos (leer y escribir archivos)

const router = Router();
const PRODUCTS_PATH = "./src/data/products.json"; // ruta al archivo de productos .JSON

//! función para leer productos
const readProducts = () => {
    if (!fs.existsSync(PRODUCTS_PATH)) return []; // si el archivo no existe, devuelve un array vacío
    const data = fs.readFileSync(PRODUCTS_PATH, "utf-8"); // lee el archivo de productos y lo devuelve como un array de objetos
    return JSON.parse(data || "[]"); // si el archivo está vacío, devuelve un array vacío
};

//! VISTA HOME
// GET /home
router.get("/home", (req, res) => {

    const products = readProducts(); // lee los productos del archivo JSON la funcion de antes

    // renderiza la vista home.handlebars
    res.render("home", { products });
});


//! VISTA REALTIME PRODUCTS
// GET /realtimeproducts
router.get("/realtimeproducts", (req, res) => {

    const products = readProducts();

    res.render("realTimeProducts", { products }); // renderiza la vista realTimeProducts.handlebars
});

export default router;