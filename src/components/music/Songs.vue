<template>

  <v-container v-if="loading">
    <v-row  justify="center" align="center" style="height: 70vh;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>
  </v-container>

  <v-container v-else>
    <v-row class="my-4" align="center" justify="space-between">
      <!-- Search Bar -->
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="searchQuery"
          label="Search songs"
          hide-details
          clearable
          density="compact"
          variant="outlined"
          append-icon="mdi-magnify"
          dense
        ></v-text-field>
      </v-col>
      <!-- Add New Song Button -->
      <v-col cols="12" sm="3" class="text-center">
        <v-btn color="primary" @click="addNewSong" elevation="2">
          Add New Song
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="elevation-4">
      <v-list lines="two" nav>
        <template v-for="(song, index) in songs" :key="song.id">
          <v-list-item :prepend-avatar="song.image">
            <!-- Song Title and Author -->
            <v-list-item-title class="song-title">{{ song.title }}</v-list-item-title>
            <v-list-item-subtitle class="author-name">{{ song.artist }}</v-list-item-subtitle>
            <!-- Play Button Column -->
            <v-list-item-action>
              <v-btn variant="text" color="primary" @click="playSong(song)">Play</v-btn>
            </v-list-item-action>
            <template #append>
              <v-list-item-action>
                <v-menu offset-y>
                  <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props" variant="flat">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="() => $router.push({ path: `/song/${song.id}` })">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteSong(song)">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </template>
          </v-list-item>
                    <!-- Add Divider for all except the last item -->
          <v-divider v-if="index < songs.length - 1"></v-divider>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import urlProvider from "@/providers/UrlProvider.js";
import audioPlayer from '@/core/AudioPlayer.js'
import SongsService from "@/core/SongsService.js";
export default {
  name: "Songs",
  async created() {
    try {
      this.songs = await this.loadSongs()
    } catch (error) {
      console.error('Failed to load songs:', error);
    } finally {
      this.loading = false;
    }
  },
  data() {
    return {
      searchQuery: '',
      loading: true,
      songs: [],
    };
  },
  methods: {
    async playSong(song) {
      if (!await audioPlayer.setSong(song)) {
        console.error('Failed to set song')
        return
      }
      audioPlayer.play()
      console.log(`Playing song: ${song.title}`);
    },
    async loadSongs() {
      const songService = new SongsService()
      return songService.loadSongs()
    },
    addNewSong() {
      this.$router.push({ path: '/song' })
    }
  },
};
</script>

<style scoped>

</style>
