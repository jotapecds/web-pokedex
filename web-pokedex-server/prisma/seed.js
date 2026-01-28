// server/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('>> Iniciando o seed do banco de dados...');

    const dataPath = path.join(__dirname, 'dados_iniciais.json');
    const dadosBrutos = fs.readFileSync(dataPath, 'utf-8');
    const dadosJSON = JSON.parse(dadosBrutos);

    // Coleta o nome de cada tipo (sem recorrência)
    const setTipos = new Set();
    dadosJSON.forEach(p => {
        if (p.tipo_primario) 
            setTipos.add(p.tipo_primario);
        if (p.tipo_secundario) 
            setTipos.add(p.tipo_secundario);
    });

    // Mapa para relacionar os tipos criados com seus códigos
    const mapaTipos = {}; 

    // Cria os tipos no banco de dados
    for (const nome of setTipos) {
        const novoTipo = await prisma.tipo.create({
            data: { nome: nome }
        });
        mapaTipos[nome] = novoTipo.codigo; 
    }

    console.log('> Tipos populados com sucesso!');

    // Cria os pokemons no banco de dados
    for (const poke of dadosJSON) {
        await prisma.pokemon.create({
            data: {
                codigo: poke.codigo,
                nome: poke.nome,
                codigo_tipo_primario: mapaTipos[poke.tipo_primario],
                codigo_tipo_secundario: poke.tipo_secundario ? mapaTipos[poke.tipo_secundario] : null
            }
        });
    }

    console.log('> Pokemons populados com sucesso!');
    console.log('>> Seed do banco de dados finalizado com sucesso.');
}

main()
.catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});