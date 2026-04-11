import { Router } from "express";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

const router = Router();

//! Crear nuevo carrito
router.post("/", async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] }); //* Creo un carrito nuevo con un array vacío de productos
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

//! Obtener carrito por ID con productos poblados
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product"); //* Populo campo "product" dentro de cada producto del carrito para tener acceso a los detalles prdto.

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

//! Agregar producto al carrito o incrementar cantidad si ya existe
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid); //* Busco el carrito por ID
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const product = await Product.findById(pid); //* Busco el producto por ID para validar que existe antes de agregarlo al carrito
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    
    //? comparo producto con :pid para ver si ya existe dentro del carrito
    const productIndex = cart.products.findIndex(
      p => p.product.toString() === pid
    );

    //? si el producto existe aumento cantidad, sino lo agrego al carrito con cantidad 1
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

//! Vaciar carrito
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid); //* Busco el carrito por ID para validar que existe antes de vaciarlo

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    cart.products = []; //* Vacío el array de productos del carrito
    await cart.save();

    res.json({ message: "Carrito vaciado" });
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
});

//! Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params; 

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    //? Verifico si el producto existe en el carrito
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

//! Reemplazar productos del carrito por un nuevo array de productos
router.put("/:cid", async (req, res) => {
  try {
    //? Validación de que el carrito existe antes de actualizarlo
    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products: req.body.products },
      { new: true } //* Devuelve el carrito actualizado después de modificarlo
    );

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar carrito" });
  }
});

//! Actualizar cantidad de un producto específico dentro del carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    //? Verifico si el producto existe en el carrito
    const productInCart = cart.products.find(
      p => p.product.toString() === pid
    );

    if (!productInCart) {
      return res.status(404).json({ error: "Producto no está en el carrito" });
    }

    productInCart.quantity = quantity; //* Actualizo la cantidad del producto en el carrito

    await cart.save();

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar cantidad" });
  }
});

export default router;
