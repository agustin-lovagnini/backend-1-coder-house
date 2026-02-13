import express from "express"; // Importa Express
import fs from "fs"; // con esto importo el módulo de sistema de archivos para leer y escribir archivos JSON

const PRODUCTS_PATH = "./src/products.json"; // Ruta al archivo JSON de productos

const readProducts = () => {
  if (!fs.existsSync(PRODUCTS_PATH)) return [];
  const data = fs.readFileSync(PRODUCTS_PATH, "utf-8");
  return JSON.parse(data || "[]");
};// Función para leer productos desde el archivo JSON

const writeProducts = (products) => {
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2));
}; // Función para escribir productos al archivo JSON


const app = express(); // Crea aplicación Express
app.use(express.json()); //  parsear JSON

// El inicio de la de todo, es como la puerta principal
app.get("/", (req, res) => {
  res.send("Hola mundo, soy Agustin, el servidor está funcionando correctamente");
}); // Ruta raíz que devuelve un mensaje de bienvenida



// !---------------------- PRODUCTOS -----------------------------

// Obtener todos los productos
app.get("/api/products", (req, res) => {
  const products = readProducts();
  res.json(products);
});


// Obtener un producto por ID
app.get("/api/products/:id", (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);

  const product = products.find(p => p.id === id); //! busca el producto por ID

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" }); //! si no lo encuentra, devuelve un error 404
  }

  res.json(product);
});


// Actualizar un producto por ID
app.put("/api/products/:id", (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);

  const index = products.findIndex(p => p.id === id); //! busca el índice del producto por ID

  if (index === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id: products[index].id
  }; //! actualiza el producto con los datos del cuerpo de la solicitud

  writeProducts(products);

  res.json(products[index]);
});


// Crear un nuevo producto
app.post("/api/products", (req, res) => {
  const products = readProducts();

  const nextId =
    products.length > 0
      ? products[products.length - 1].id + 1
      : 1; //! determina el próximo ID disponible

  const newProduct = {
    id: nextId,
    ...req.body
  }; //! crea un nuevo producto con los datos del cuerpo de la solicitud

  products.push(newProduct);

  writeProducts(products);

  res.status(201).json(newProduct);
});


// Eliminar un producto por ID
app.delete("/api/products/:id", (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);

  const filteredProducts = products.filter(p => p.id !== id);

  writeProducts(filteredProducts);

  res.json({ message: "Producto eliminado" });
});



// !---------------------- CARRITOS -----------------------------

// Ruta al archivo JSON de carritos
const CARTS_PATH = "./src/carts.json";

// Función para leer carritos desde el archivo JSON
const readCarts = () => {
  if (!fs.existsSync(CARTS_PATH)) return [];
  const data = fs.readFileSync(CARTS_PATH, "utf-8");
  return JSON.parse(data || "[]");
};

// Función para escribir carritos al archivo JSON
const writeCarts = (carts) => {
  fs.writeFileSync(CARTS_PATH, JSON.stringify(carts, null, 2)); 
}; 

// Crear un nuevo carrito
app.post("/api/carts", (req, res) => {
  const carts = readCarts();

  const nextId =
    carts.length > 0
      ? carts[carts.length - 1].id + 1
      : 1; //! determina el próximo ID disponible

  const newCart = {
    id: nextId,
    products: []
  }; //! crea un nuevo carrito vacío

  carts.push(newCart);
  writeCarts(carts);

  res.status(201).json(newCart);
});


// Obtener productos de un carrito por ID
app.get("/api/carts/:cid", (req, res) => {
  const carts = readCarts();
  const id = parseInt(req.params.cid);

  const cart = carts.find(c => c.id === id);

  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  res.json(cart.products);
});

// Agregar un producto a un carrito por ID
app.post("/api/carts/:cid/product/:pid", (req, res) => {
  const carts = readCarts(); //! Lee los carritos existentes
  const products = readProducts(); //! Lee los productos para verificar si el producto existe

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

  const productInCart = cart.products.find(p => p.product === productId); //! Verifica si el producto ya está en el carrito

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({
      product: productId,
      quantity: 1
    }); //! Si no está, lo agrega con cantidad 1
  }

  writeCarts(carts);

  res.json(cart);
});

// Inicia el servidor en el puerto 8080
app.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
}); 


//! */ ---------- anotaciones ---------------------

// npm start para iniciar el servidor 
// http://localhost:8080/ para acceder al servidor
//ctrl + c para detener el servidor