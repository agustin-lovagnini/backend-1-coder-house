import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/product.js";

const router = Router();

//! Listado de productos con paginación, ordenamiento y filtrado
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    let filter = {}; //* Filtro vacío por defecto, se va a ir armando según query

    //* decidimos que filtrar?
    if (query) {
      if (query === "true" || query === "false") {
        filter.stock = query === "true" ? { $gt: 0 } : 0;
      } else {
        filter.category = query;
      }
    }

    //! Opciones para paginación, ordenamiento
    const options = {
      page: Number(page),
      limit: Number(limit),
      sort:
        sort === "asc"
          ? { price: 1 }
          : sort === "desc"
            ? { price: -1 }
            : {}
    };

    const result = await Product.paginate(filter, options); //* Uso paginate para obtener productos con paginación, ordenamiento y filtrado

    //! URL base para construir los links de paginación
    const baseUrl = "http://localhost:8080/api/products";

    //! devolvo en la respuesta URLs listas para ir a la página anterior o siguiente sin perder filtros
    const buildLink = (pageNum) => {
      let url = `${baseUrl}?page=${pageNum}&limit=${limit}`;

      if (query) url += `&query=${query}`;
      if (sort) url += `&sort=${sort}`;

      return url;
    };

    //! Respuesta con productos y datos de paginación
    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    });

  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

//! Función para obtener el carrito o crear uno nuevo si no existe por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    //? validacion ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" }); //! No consulto con ID aml formado
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

//! Crear nuevo producto
router.post("/", async (req, res) => {
  try {
    const { title, price } = req.body;

    //? Validación de campos obligatorios
    if (!title || !price) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const product = await Product.create(req.body);

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
});

//! Actualizar producto por ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    //? Validación de ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const deleted = await Product.findByIdAndDelete(id); //* Elimina el producto por ID, devuelve el producto eliminado o null si no se encontró

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado" });

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;
