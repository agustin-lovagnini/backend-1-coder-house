import express from "express"; // creo el servidor y manejar las rutas
import { engine } from "express-handlebars"; // para usar handlebars como motor de plantillas (vistas) en el servidor

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("🔥 Mongo conectado"))
  .catch(err => console.log("❌ Error Mongo:", err));

//! routers
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

//! IMPORTAR HTTP
import { createServer } from "http"; // creo un servidor HTTP a partir de la aplicación de express, necesario para usar socket.io

//! IMPORTAR SOCKET.IO
import { Server } from "socket.io"; // creo un servidor de socket.io --> se conectará al servidor HTTP (sirve para el manejode la comunicación en tiempo real entre el servidor y los clientes)

//! IMPORTAR FS
import fs from "fs"; // para leer y escribir archivos 


//------------------- o -------------------//

//! ---- SERVIDOR ----
const app = express(); // creo el servidor con express

app.use(express.json()); // el servidor pueda entender los datos en formato JSON

app.use(express.urlencoded({ extended: true })); // para que el servidor pueda entender los datos enviados desde formularios HTML


//! ---- HANDLEBARS ----
//? (RECORDATORIO): Las vistas están en /views. El motor de plantillas es handlebars
app.engine("handlebars", engine()); // configuro handlebars como motor de plantillas
app.set("view engine", "handlebars"); // le digo a express que use handlebars como motor de vistas
app.set("views", "./src/views"); // le digo a express donde están las vistas (plantillas)


//! ---- RUTAS ----
// con esto conecto las rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


//! ---- CREAR SERVIDOR HTTP ----
const server = createServer(app); // creo un servidor HTTP a partir de la aplicación de express, necesario para usar socket.io

//! ----SOCKET.IO ----
const io = new Server(server); // creo el servidor de socket.io a partir del servidor HTTP creado con express


const PRODUCTS_PATH = "./src/data/products.json"; // ruta al archivo donde se guardarán los productos


// leer productos --> FUNCTION
const readProducts = () => {
  if (!fs.existsSync(PRODUCTS_PATH)) return [];
  const data = fs.readFileSync(PRODUCTS_PATH, "utf-8");
  return JSON.parse(data || "[]");
};

// guardar productos --> FUNCTION
const writeProducts = (products) => {
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2)); // ITERACION DE 2 ESPACIOS 
};


//! ---- CONEXIÓN DE SOCKET ----
//* emit → enviar información
//* on → escuchar información
//? (RECORDATORIO): escucho cuando un cliente se conecta al servidor de socket.io
io.on("connection", (socket) => {

  console.log("Cliente conectado");
  socket.emit("updateProducts", readProducts()); // envío el array de productos al cliente que se acaba de conectar para que tenga la información actualizada al cargar la página

  // escucho cuando el cliente envía un producto
  socket.on("newProduct", (product) => {

    console.log("Nuevo producto recibido:", product);

    const products = readProducts();

    // asigno un ID incremental al nuevo producto
    const nextId =
      products.length > 0
        ? products[products.length - 1].id + 1
        : 1;

    // creo el nuevo producto con el ID asignado
    const newProduct = {
      id: nextId,
      ...product //** spread operator para incluir el resto de las propiedades del producto
    };

    products.push(newProduct); // agrego el nuevo producto al array de productos

    writeProducts(products); // guardo el array actualizado en products.json

    console.log("Producto guardado en products.json");
    io.emit("updateProducts", products); // sale el mensaje para todos los clientes conectados

  });

  //? (RECORDATORIO): escucho cuando el cliente envía un ID de producto para eliminar
  socket.on("deleteProduct", (id) => {

    console.log("Eliminar producto con id:", id);

    const products = readProducts();

    const filteredProducts = products.filter(p => p.id !== id); // creo un nuevo array sin el producto que se quiere eliminar

    writeProducts(filteredProducts);

    // avisar a todos los clientes que el producto fue eliminado
    io.emit("updateProducts", filteredProducts);

  });

});


server.listen(8080, () => {

  console.log("Servidor corriendo en puerto 8080");

});