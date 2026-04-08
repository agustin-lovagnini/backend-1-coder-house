import express from "express";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import dotenv from "dotenv";

import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Mongo
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("🔥 Mongo conectado"))
  .catch(err => console.log("❌ Error Mongo:", err));

// 🔥 Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// 🔥 Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// 🔥 Server
app.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});