<template>
  <v-container class="py-4">
    <v-row>
      <!-- Photo on the left -->
      <v-col cols="12" md="4" class="d-flex justify-center align-center">
        <v-img
          :src="playlist.photo"
          aspect-ratio="1"
          class="playlist-image elevation-4"
          alt="Playlist Photo"
        >
          <template v-slot:placeholder>
            <v-row justify="center" align="center" class="fill-height ma-0">
              <v-col cols="auto">
                <v-icon color="grey" size="100">mdi-music</v-icon>
              </v-col>
            </v-row>
          </template>
        </v-img>
      </v-col>

      <!-- Songs list on the right -->
      <v-col cols="12" md="8">
        <v-card class="elevation-3">

          <v-card-text>
            <!-- Playlist description -->
            <p v-if="playlist.description" class="mb-4">{{ playlist.description }}</p>

            <!-- List of Songs -->
            <v-data-table
              :headers="songHeaders"
              :items="playlist.songs"
              class="elevation-1"
              dense
            >
              <template #item.actions="{ item }">
                <v-menu offset-y>
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon variant="flat">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="playSong(item)">
                      Play Song
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PlaylistsService from "@/core/PlaylistsService.js";
import SongsService from "@/core/SongsService.js";
import audioPlayer from "@/core/AudioPlayer.js";
import urlProvider from "@/providers/UrlProvider.js";
export default {
  name: "PlaylistView",
  data() {
    return {
      playlist: {
        id: null,
        name: "",
        description: "",
        photo: "", // URL for the playlist photo
        songs: [], // List of songs in the playlist
      },
      songHeaders: [
        { text: "Title", value: "title", align: "start" },
        { text: "Artist", value: "artist" },
        { text: "Actions", value: "actions", align: "end" },
      ],
    };
  },
  async mounted() {
    const playlistId = this.$route.params.id;
    if (playlistId) {
      await this.fetchPlaylist()
      await this.fetchSongs(playlistId)
    }
  },
  methods: {
    async fetchPlaylist() {
      // Get playlist by ID from route params
      const playlistId = this.$route.params.id;

      const playlistsUrl = urlProvider.getFullUrlForEndpoint(`Playlists/${playlistId}`)

      try {
        // Replace with your actual API call
        const response = await fetch(playlistsUrl, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.status !== 200) {
          console.error("Failed to fetch playlist");
          return;
        }
        const data = await response.json();

        // Set playlist details
        this.playlist.id = data.id;
        this.playlist.name = data.name;
        this.playlist.description = data.description || "";
        this.playlist.photo = data.photo || ""; // Use placeholder if photo is missing
        this.playlist.songs = data.songs || [];
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    },
    async fetchSongs(id) {
      try {
        const playlistsService = new PlaylistsService(new SongsService())
        this.playlist.songs = await playlistsService.loadSongs(id)
      } catch (error) {
        console.error("Failed to fetch playlist:", error);
      }
    },
    async playSong(song) {
      await audioPlayer.setSong(song)
      audioPlayer.play()
    },
    deletePlaylist() {
      if (confirm(`Are you sure you want to delete "${this.playlist.name}"?`)) {
        alert("Delete playlist functionality to be implemented!");
      }
    },
  },
};
</script>

<style scoped>
.playlist-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
}
</style>
