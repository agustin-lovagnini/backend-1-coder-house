Proyecto backend con `Express`, `Handlebars`, `MongoDB` y `Socket.io` para gestionar productos y carritos.

## Funcionalidades

- API de productos en `/api/products`
- API de carritos en `/api/carts`
- Vista de productos en `/products`

## Como ejecutar el proyecto

1. Instalar dependencias:

```bash
npm install
```

2. Crear un archivo `.env` en la raiz del proyecto con la variable `MONGO_URL`:

```env
MONGO_URL=mongodb+srv://USUARIO:CONTRASENA@cluster0.kapodey.mongodb.net/ecommerce?retryWrites=true&w=majority
```

Reemplazar:

- `USUARIO` por tu usuario de MongoDB Atlas
- `CONTRASENA` por la password real de ese usuario
- `ecommerce` por el nombre de la base de datos que quieras usar

Si otra persona clona el repositorio, solo tiene que crear su propio archivo `.env` con su usuario, su contrasena y su base de datos.

3. Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

## Rutas utiles

- `http://localhost:8080/products`

## Notas

- El proyecto usa la conexion a MongoDB definida en el archivo `.env`
- Actualmente el servidor esta configurado en el puerto `8080` en `src/app.js`
- No se debe subir el archivo `.env` al repositorio

## Estructura de la base de datos

La base de datos usada en este proyecto se llama `ecommerce` y contiene 2 colecciones:

- `products`
- `carts`

### Coleccion `products`

Cada producto tiene una estructura similar a esta:

```json
{
  "_id": "ObjectId",
  "title": "Yamaha Crypton",
  "description": "Moto urbana confiable",
  "price": 1300,
  "category": "urbana",
  "type": "moto",
  "stock": 15,
  "code": "URB002"
}
```

### Coleccion `carts`

Cada carrito guarda un arreglo de productos referenciando el `_id` de la coleccion `products`:

```json
{
  "_id": "ObjectId",
  "products": [
    {
      "product": "ObjectId del producto",
      "quantity": 2
    }
  ]
}
```

### Importante

- La coleccion `carts` referencia productos de `products` mediante `ObjectId`
- Si otra persona quiere probar el proyecto con su propia base, debe crear las colecciones `products` y `carts` con esta estructura
