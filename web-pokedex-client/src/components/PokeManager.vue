<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="textoBusca"
          label="Buscar por nome"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
        ></v-text-field>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-select
          v-model="filtroTipo"
          :items="opcoesTipoFiltro"
          label="Filtrar por Tipo"
          variant="outlined"
          density="compact"
          hide-details
        ></v-select>
      </v-col>
      
      <v-col cols="12" md="4" class="text-right">
        <v-btn 
          color="red-darken-2" 
          prepend-icon="mdi-plus" 
          elevation="2"
          @click="openDialog()"
        >
          Novo Pokemon
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col 
        v-for="poke in pokemonsFiltrados" 
        :key="poke.codigo" 
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card hover elevation="4" class="h-100 d-flex flex-column">
          <v-card-title class="text-white text-capitalize font-weight-bold" style="background: rgba(0,0,0,0.5)">
            {{ poke.nome }}
          </v-card-title>
          
          <v-card-text class="pt-4">
            <div class="text-caption mb-1">Tipos:</div>
            <div class="d-flex flex-wrap ga-2">
              
              <v-chip 
                v-if="poke.tipoPrimario"
                class="text-white font-weight-bold"
                size="default"
                label
              >
                {{ poke.tipoPrimario.nome }}
              </v-chip>

              <v-chip 
                v-if="poke.tipoSecundario"
                class="text-white font-weight-bold"
                size="small"
                label
              >
                {{ poke.tipoSecundario.nome }}
              </v-chip>

            </div>
          </v-card-text>

          <v-spacer></v-spacer>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              variant="text" 
              color="blue-darken-1" 
              prepend-icon="mdi-pencil"
              @click="openDialog(poke)"
            >
              Editar
            </v-btn>
            <v-btn 
              variant="text" 
              color="red-darken-1" 
              icon="mdi-delete"
              @click="excluir(poke.codigo)"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="bg-red-darken-2 text-white">
          <span class="text-h5">{{ itemEditado.codigo ? 'Editar Pokemon' : 'Novo Pokemon' }}</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field 
                  v-model="itemEditado.nome" 
                  label="Nome do Pokemon *" 
                  variant="outlined"
                  :rules="[v => !!v || 'O nome é obrigatório']"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="itemEditado.codigo_tipo_primario"
                  :items="tiposDisponiveis"
                  item-title="nome"
                  item-value="codigo"
                  label="Tipo Primário *"
                  variant="outlined"
                  :rules="[v => !!v || 'Obrigatório']"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="itemEditado.codigo_tipo_secundario"
                  :items="tiposDisponiveis"
                  item-title="nome"
                  item-value="codigo"
                  label="Tipo Secundário"
                  variant="outlined"
                  clearable
                  hint="Opcional"
                  persistent-hint
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="blue-darken-1" variant="elevated" @click="salvar">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  tiposDisponiveis: { type: Array, default: () => [] }
});

const pokemons = ref([]);
const textoBusca = ref('');
const filtroTipo = ref('Todos');
const dialog = ref(false);

const itemDefault = { 
  codigo: null, 
  nome: '',  
  codigo_tipo_primario: null, 
  codigo_tipo_secundario: null 
};
const itemEditado = ref({ ...itemDefault });

// Configuração Base da API
const api = axios.create({
  baseURL: 'http://localhost:8080/'
});

// -- Requisições API --
const popularPokemons = async () => {
  try {
    const response = await api.get('/pokemons');
    pokemons.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar pokemons:", error);
  }
};

const salvar = async () => {
  if (!itemEditado.value.nome || !itemEditado.value.codigo_tipo_primario) {
    alert("Preencha os campos obrigatórios!");
    return;
  }

  const payload = {
    nome: itemEditado.value.nome,
    codigo_tipo_primario: itemEditado.value.codigo_tipo_primario,
    codigo_tipo_secundario: itemEditado.value.codigo_tipo_secundario || null 
  };

  try {
    if (itemEditado.value.codigo) {
      // EDIÇÃO (PUT)
      await api.put(`/pokemon/${itemEditado.value.codigo}`, payload);
    } else {
      // CRIAÇÃO (POST)
      await api.post('/pokemon', payload);
    }
    
    await popularPokemons(); 
    closeDialog();
  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Erro ao salvar.");
  }
};

const excluir = async (codigo) => {
  if (!confirm('Tem certeza que deseja excluir?')) return;

  try {
    await api.delete(`/pokemon/${codigo}`);
    await popularPokemons();
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
};

// -- Métodos de Tela --

onMounted(() => {
  popularPokemons();
});

const opcoesTipoFiltro = computed(() => ['Todos', ...props.tiposDisponiveis.map(t => t.nome)]);

const pokemonsFiltrados = computed(() => {
  return pokemons.value.filter(poke => {
    const matchNome = poke.nome.toLowerCase().includes(textoBusca.value.toLowerCase());
    const matchTipo = filtroTipo.value === 'Todos' || 
                      poke.tipoPrimario?.nome === filtroTipo.value || 
                      poke.tipoSecundario?.nome === filtroTipo.value;
    return matchNome && matchTipo;
  });
});

const openDialog = (item) => {
  if (item) {
    itemEditado.value = {
      codigo: item.codigo,
      nome: item.nome,
      imagem: item.imagem,
      codigo_tipo_primario: item.tipoPrimario?.codigo,
      codigo_tipo_secundario: item.tipoSecundario?.codigo || null
    };
  } else {
    itemEditado.value = { ...itemDefault };
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  setTimeout(() => {
    itemEditado.value = { ...itemDefault };
  }, 300);
};
</script>