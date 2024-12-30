<script setup>
import { useRouter, RouterLink, RouterView } from 'vue-router'
import {useUserStore} from "@/stores/userStore.js";
import { ref, onMounted } from "vue";
import urlProvider from "@/providers/UrlProvider.js";
import AudioPlayer from "@/components/music/AudioPlayer.vue";
import VoiceCommandOverlay from "@/components/VoiceCommandOverlay.vue";


const router = useRouter()

const drawer = ref(true)
function toggleDrawer() {
  drawer.value = !drawer.value
}

async function logout() {
  const url = urlProvider.getBaseUrl() + '/Authentication/logout'
  const res = await fetch(url, {
    credentials: 'include',
    method: 'POST',
    headers: new Headers({'content-type': 'application/json'}),
  })
  if (res.status === 200) {
    await router.push('/login')
  }
}

onMounted(async () => {
  const store = useUserStore()
  const resp  = await fetch(urlProvider.getBaseUrl() + '/Authentication/user', {
    method: 'GET',
    credentials: 'include',
    headers: new Headers({'content-type': 'application/json'}),
  })

  if (resp.status !== 200) {
    console.error("Error on getting user info: " + await resp.text())
    return
  }
  store.setInfo(await resp.json())
})

function isAuthorized() {
}

</script>

<template>
  <v-app>
    <v-app-bar v-if="!['login', 'register'].includes($route.name)" app>
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <v-toolbar-title>Music library net</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <!-- Avatar Button -->
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar>
              A
            </v-avatar>
          </v-btn>
        </template>

        <!-- Dropdown Menu -->
        <v-list>
          <v-list-item to="/profile" prepend-icon="mdi-account" tag="router-link">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-list-item prepend-icon="mdi-logout" @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer
      v-if="!['login', 'register'].includes($route.name)"
      v-model="drawer"
      app
      permanent
      expand-on-hover
    >
      <v-list dense>
        <v-list-item to="/" prepend-icon="mdi-home"  tag="router-link">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item to="/library" prepend-icon="mdi-music" tag="router-link">
          <v-list-item-title>Library</v-list-item-title>
        </v-list-item>
        <v-list-item to="/alfred" prepend-icon="mdi-robot-happy" tag="router-link">
          <v-list-item-title>Alfred AI</v-list-item-title>
          <template #append>
            <v-badge
              color="info"
              content="BETA"
              inline
            />
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <RouterView />
    </v-main>
    <v-bottom-navigation v-if="!['login', 'register'].includes($route.name)" class="ma-0 pa-0" height="72" app>
      <AudioPlayer />
    </v-bottom-navigation>
    <VoiceCommandOverlay />
  </v-app>
<div id="audio-container"></div>
</template>

<style scoped>
</style>
