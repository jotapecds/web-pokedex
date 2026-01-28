require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 8080;
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cors());

// -- Rotas de CREATE --
app.post('/pokemon', async (req, res) => {
    const { nome, codigo_tipo_primario, codigo_tipo_secundario } = req.body;
    
    try {
        const novoPokemon = await prisma.pokemon.create({
            data: {
                nome,
                codigo_tipo_primario: Number(codigo_tipo_primario),
                codigo_tipo_secundario: codigo_tipo_secundario ? Number(codigo_tipo_secundario) : null
            }
        });
        res.status(201).json(novoPokemon);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Erro ao criar pokemon" });
    }
});

app.post('/tipo', async (req, res) => {
    const { nome } = req.body;

    try {
        const novoTipo = await prisma.tipo.create({
            data: { nome }
        });
        res.status(201).json(novoTipo);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Erro ao criar tipo" });
    }
});

// -- Rotas de READ --
app.get('/', (req, res) => {
    res.json({ message: "Hello World!" });
});

app.get('/pokemons', async (req, res) => {
    try {
        const pokemons = await prisma.pokemon.findMany({
            include: { 
                tipoPrimario: true,
                tipoSecundario: true
            } 
        });
        res.json(pokemons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao recuperar dados dos pokemons" });
    }
});

app.get('/pokemon/:codigo', async (req, res) => {
    const { codigo } = req.params;

    try {
        const pokemon = await prisma.pokemon.findUnique({
            where: { 
                codigo: Number(codigo) 
            },
            include: { 
                tipoPrimario: true,
                tipoSecundario: true
            } 
        });

        if (pokemon) {
            res.json(pokemon);
        } else {
            res.status(404).json({ error: "Pokemon não encontrado." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao recuperar dados do pokemon" });
    }
});

app.get('/tipos', async (req, res) => {
    try {
        const tipos = await prisma.tipo.findMany();
        res.json(tipos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao recuperar dados dos tipos" });
    }
});

app.get('/tipo/:codigo', async (req, res) => {
    const { codigo } = req.params;

    try {
        const tipo = await prisma.tipo.findUnique({
            where: { 
                codigo: Number(codigo) 
            }
        });

        if (tipo) {
            res.json(tipo);
        } else {
            res.status(404).json({ error: "Tipo não encontrado." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao recuperar dados do tipo" });
    }
});

// -- Rotas de UPDATE --
app.put('/pokemon/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const { nome, codigo_tipo_primario, codigo_tipo_secundario } = req.body;

    try {
        const pokemonAtualizado = await prisma.pokemon.update({
            where: { 
                codigo: Number(codigo)
            },
            data: { 
                nome, 
                codigo_tipo_primario: Number(codigo_tipo_primario),
                codigo_tipo_secundario: codigo_tipo_secundario ? Number(codigo_tipo_secundario) : null 
            }
        });
        res.json(pokemonAtualizado);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Pokemon não encontrado ou erro nos dados." });
    }
});

app.put('/tipo/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const { nome } = req.body;

    try {
        const tipoAtualizado = await prisma.tipo.update({
            where: { 
                codigo: Number(codigo) 
            },
            data: { nome }
        });
        res.json(tipoAtualizado);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Tipo não encontrado ou erro nos dados." });
    }
});

// -- Rotas de DELETE --
app.delete('/pokemon/:codigo', async (req, res) => {
    const { codigo } = req.params;

    try {
        await prisma.pokemon.delete({
            where: { 
                codigo: Number(codigo) 
            }
        });
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Pokemon não encontrado." });
    }
});

app.delete('/tipo/:codigo', async (req, res) => {
    const { codigo } = req.params;

    try {
        await prisma.tipo.delete({
            where: { 
                codigo: Number(codigo) 
            }
        });
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Tipo não encontrado." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});