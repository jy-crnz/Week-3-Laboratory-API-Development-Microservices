const express = require('express');
const { authenticateToken } = require('./auth-middleware'); // Import authentication middleware
const app = express();

const PORT = process.env.PRODUCT_PORT || 4808;
app.use(express.json());

// Sample Products Data
const products = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Phone' }
];

// Public Endpoint (Anyone can access)
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Protected Endpoint (Only authenticated users can add products)
app.post('/api/products', authenticateToken, (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Product name is required." });

    const newProduct = { id: products.length + 1, name };
    products.push(newProduct);

    res.status(201).json({ message: "Product added successfully", product: newProduct });
});

// Start Product Service
app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
});
