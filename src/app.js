

import express from "express"; // importo libreria express

const app = express(); // instancia de express - basicamente es nuestro servidor guardado en una varriable "app"

app.use(express.json()); // eso me ayuda cuando quiera recibir datos del body en formato json, express, lo pueda entender y usarlo en req.body

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
}); // cuando el cliente haga una peticion get, el servidor va a responder con un mensaje "Servidor funcionando"

app.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
}); // el servidor va a escuchar en el puerto 8080, y cuando este listo, va a mostrar un mensaje en la consola "Servidor corriendo en puerto 8080"
