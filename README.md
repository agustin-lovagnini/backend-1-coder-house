Proyecto backend con `Express`, `Handlebars` y `Socket.io` para gestionar productos y carritos.

## Funcionalidades

- API de productos en `/api/products`
- API de carritos en `/api/carts`
- Vista `home` en `/home` con listado de productos
- Vista `realTimeProducts` en `/realtimeproducts` con actualizacion en tiempo real
- Alta y eliminacion de productos mediante websockets

## Como ejecutar el proyecto

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar el servidor:

```bash
npm start
```

3. Abrir en el navegador:

- `http://localhost:8080/home`
- `http://localhost:8080/realtimeproducts`

## Notas
- Los productos se guardan en `src/data/products.json`
- Los carritos se guardan en `src/data/carts.json`
