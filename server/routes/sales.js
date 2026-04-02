const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, quantity, paymentMethod } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const total = product.sellPrice * quantity;
    const profit = (product.sellPrice - product.buyPrice) * quantity;

    const sale = new Sale({
      productId,
      productName: product.name,
      quantity,
      sellingPrice: product.sellPrice,
      total,
      profit,
      paymentMethod: paymentMethod || 'cash'
    });

    await sale.save();

    product.stockQuantity -= quantity;
    await product.save();

    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;