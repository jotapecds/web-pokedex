<template>
  <v-card elevation="3">
    <v-card-title class="d-flex align-center bg-grey-lighten-3 pa-4">
      <v-icon icon="mdi-format-list-bulleted-type" class="mr-2"></v-icon>
      Gerenciar Tipos
      <v-spacer></v-spacer>
      <v-btn 
        color="red-darken-2" 
        prepend-icon="mdi-plus" 
        @click="openDialog()"
      >
        Novo Tipo
      </v-btn>
    </v-card-title>

    <v-table hover>
      <thead>
        <tr>
          <th class="text-left">Código</th>
          <th class="text-left">Nome</th>
          <th class="text-right">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in types" :key="item.codigo">
          <td>{{ item.codigo }}</td>
          <td>
            <v-chip 
              size="default" 
              class="text-white font-weight-bold"
              label
            >
              {{ item.nome }}
            </v-chip>
          </td>
          <td class="text-right">
            <v-btn 
              icon="mdi-pencil" 
              size="small" 
              variant="text" 
              color="blue" 
              @click="openDialog(item)"
            ></v-btn>
            <v-btn 
              icon="mdi-delete" 
              size="small" 
              variant="text" 
              color="red" 
              @click="excluir(item.codigo)"
            ></v-btn>
          </td>
        </tr>
        <tr v-if="types.length === 0">
          <td colspan="5" class="text-center text-grey pa-4">
            Nenhum tipo cadastrado.
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="dialog" max-width="400px" persistent>
      <v-card>
        <v-card-title class="bg-red-darken-2 text-white">
          {{ editedItem.codigo ? 'Editar Tipo' : 'Novo Tipo' }}
        </v-card-title>

        <v-card-text class="pt-4">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.nome"
                  label="Nome do Tipo *"
                  variant="outlined"
                  placeholder="Ex: Fogo"
                  :rules="[v => !!v || 'Nome é obrigatório']"
                ></v-text-field>
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
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps(['types']);

// Emite evento para o App.vue recarregar a lista após mudanças
const emit = defineEmits(['tipos-atualizados']);

const dialog = ref(false);
const defaultItem = { codigo: null, nome: '' };
const editedItem = ref({ ...defaultItem });

// Configura API
const api = axios.create({
  baseURL: 'http://localhost:8080/'
});

// -- Requisições API --
const salvar = async () => {
  if (!editedItem.value.nome) {
    alert("Preencha o nome!");
    return;
  }

  try {
    const payload = {
      nome: editedItem.value.nome
    };

    if (editedItem.value.codigo) {
      // EDITAR (PUT)
      await api.put(`/tipo/${editedItem.value.codigo}`, payload);
    } else {
      // CRIAR (POST)
      await api.post('/tipo', payload);
    }

    emit('tipos-atualizados'); 
    closeDialog();

  } catch (error) {
    console.error("Erro ao salvar tipo:", error);
    alert("Erro ao salvar.");
  }
};

const excluir = async (codigo) => {
  if (!confirm('Tem certeza? Se houver pokemons com este tipo, a exclusão falhará.')) 
    return;

  try {
    await api.delete(`/tipo/${codigo}`);
    emit('tipos-atualizados');
  } catch (error) {
    console.error("Erro ao deletar:", error);
    alert("Não foi possível excluir. Verifique se existem Pokemons usando este tipo.");
  }
};

// -- Métodos de tela
const openDialog = (item) => {
  if (item) {
    editedItem.value = { ...item };
  } else {
    editedItem.value = { ...defaultItem };
  }
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  setTimeout(() => {
    editedItem.value = { ...defaultItem };
  }, 300);
};
</script>