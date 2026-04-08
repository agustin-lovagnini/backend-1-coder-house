import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/product.js";

const router = Router();

// 🔥 GET productos con PAGINACIÓN + FILTROS + SORT
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    let filter = {};

    // 🔍 FILTROS
    if (query) {
      // disponibilidad (stock)
      if (query === "true" || query === "false") {
        filter.stock = query === "true" ? { $gt: 0 } : 0;
      } else {
        // categoría
        filter.category = query;
      }
    }

    // ⚙️ OPCIONES
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

    const result = await Product.paginate(filter, options);

    // 🔗 LINKS DINÁMICOS
    const baseUrl = "http://localhost:8080/api/products";

    const buildLink = (pageNum) => {
      let url = `${baseUrl}?page=${pageNum}&limit=${limit}`;

      if (query) url += `&query=${query}`;
      if (sort) url += `&sort=${sort}`;

      return url;
    };

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

// 🔥 GET producto por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🧠 VALIDACIÓN ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
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

// 🔥 POST crear producto
router.post("/", async (req, res) => {
  try {
    const { title, price } = req.body;

    // ✅ VALIDACIÓN
    if (!title || !price) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const product = await Product.create(req.body);

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ error: "Error al crear producto" });
  }
});

// 🔥 DELETE producto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🧠 VALIDACIÓN ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado" });

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;
