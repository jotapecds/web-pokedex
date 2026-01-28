<template>
  <v-app>
    <v-app-bar color="red-darken-4" title="Web Pokedex" elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item 
          prepend-icon="mdi-heart" 
          title="Meus Pokemons" 
          value="pokemons"
          @click="currentView = 'pokemons'"
          active-color="red"
        ></v-list-item>
        <v-list-item 
          prepend-icon="mdi-bug" 
          title="Tipos" 
          value="types"
          @click="currentView = 'types'"
          active-color="red"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-4">
      <v-container>
        <PokeManager 
          v-if="currentView === 'pokemons'" 
          :available-types="types"
        />
        
        <TypeManager 
          v-if="currentView === 'types'" 
          :types="types" 
          @tipos-atualizados="popularTipos"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from './services/api';

// Componentes
import PokeManager from './components/PokeManager.vue';
import TypeManager from './components/TypeManager.vue';

const drawer = ref(true);
const currentView = ref('pokemons');
const types = ref([]); 

const popularTipos = async () => {
  try {
    const response = await api.get('/tipos');
    types.value = response.data;
  } catch (error) {
    console.error("Erro ao carregar tipos:", error);
  }
};

onMounted(() => {
  popularTipos();
});
</script>