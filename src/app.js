import express from "express"; //? Trae Express
import { engine } from "express-handlebars"; //? Trae Handlebars
import mongoose from "mongoose"; //? Trae Mongoose
import dotenv from "dotenv"; //? Trae dotenv para leer variables de entorno (.env)

import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

dotenv.config(); //* Cargao variables de .env

const app = express(); //* Instancia de Express

app.use(express.json()); //* Middleware para parsear JSON
app.use(express.urlencoded({ extended: true })); //* Middleware para parsear formularios

//! Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✔️✔️ Mongo conectado"))
  .catch(err => console.log("❌ Error Mongo:", err));

//! Configuración de Handlebars
app.engine("handlebars", engine()); // * Motor de plantillas
app.set("view engine", "handlebars"); // Express renderiza con Handlebars
app.set("views", "./src/views"); //* Donde esta guardada las vistas

//! Rutas
app.use("/api/products", productsRouter); //* Como empiezan las rutas
app.use("/api/carts", cartsRouter); //* Las rutas de carts empiezan con /api/carts
app.use("/", viewsRouter); //* Rutas para vistas empiezan con / (raíz)

//! Server
app.listen(8080, () => {
  console.log("✔️Servidor corriendo en puerto 8080");
});