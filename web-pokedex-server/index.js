const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
    res.json({ message: "Hello World!" });
});

app.get('/allData', (req, res) => {
    const data = require('./dados_iniciais.json');
    res.json(data);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});