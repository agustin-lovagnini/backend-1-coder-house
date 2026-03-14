import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express(); // creo el servidor con express

app.use(express.json()); // para que el servidor pueda entender los datos en formato JSON

// con esto conecto las rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// con esto creo la ruta GET 
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// app.get -> define una ruta GET
// "/productos" -> la URL a la que se accede
// (req, res) -> request y response


app.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});