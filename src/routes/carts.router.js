import { Router } from "express";
import Cart from "../models/cart.js";
import Product from "../models/Product.js";

const router = Router();

// 🛒 Crear carrito
router.post("/", async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

// 🛒 Obtener carrito con populate
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product");

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

// 🛒 Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      p => p.product.toString() === pid
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({
        product: pid,
        quantity: 1
      });
    }

    await cart.save();

    res.json({
      message: "Producto agregado al carrito",
      cart
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// 🧹 Vaciar carrito
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    cart.products = [];
    await cart.save();

    res.json({ message: "Carrito vaciado" });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
});

// ❌ Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    cart.products = cart.products.filter(
      p => p.product.toString() !== pid
    );

    await cart.save();

    res.json({
      message: "Producto eliminado del carrito",
      cart
    });

  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// 🔄 Reemplazar carrito completo
router.put("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products: req.body.products },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar carrito" });
  }
});

// 🔢 Actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productInCart = cart.products.find(
      p => p.product.toString() === pid
    );

    if (!productInCart) {
      return res.status(404).json({ error: "Producto no está en el carrito" });
    }

    productInCart.quantity = quantity;

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cantidad" });
  }
});

export default router;