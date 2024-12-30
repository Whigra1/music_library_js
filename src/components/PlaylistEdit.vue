<template>
<v-container class="py-4">
  <v-card class="elevation-4">
    <v-card-title>
        <span class="text-h6">
          {{ isEditMode ? 'Edit Playlist' : 'Create New Playlist' }}
        </span>
    </v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="isValid" @submit.prevent="submitForm">
        <!-- Playlist Name -->
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Playlist Name"
              v-model="playlist.name"
              variant="outlined"
              :rules="[rules.required]"
              required
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Playlist Description -->
        <v-row>
          <v-col cols="12">
            <v-textarea
              label="Description"
              v-model="playlist.description"
              variant="outlined"
              rows="3"
              clearable
            ></v-textarea>
          </v-col>
        </v-row>

        <!-- Songs in Playlist -->
        <v-data-table
          :headers="songHeaders"
          :items="playlist.songs"
          item-value="id"
          dense
          class="my-4"
        >
          <template #top>
            <v-toolbar flat class="d-flex justify-space-between">
              <v-toolbar-title>Playlist Songs</v-toolbar-title>
              <v-btn color="primary" variant="text" @click="addSong">
                Add Songs
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.actions="{ item }">
            <v-btn icon variant="flat" @click="removeSong(item)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <!-- Submit Button -->
        <v-btn color="primary" :disabled="!isValid" @click="submitForm">
          {{ isEditMode ? 'Update Playlist' : 'Create Playlist' }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</v-container>

<song-selection-dialog
  v-model="showSongSelectionDialog"
  :playlistSongs="playlist.songs"
  @save="updateSongs"
/>

</template>

<script>
import urlProvider from "@/providers/UrlProvider.js";
import SongSelectionDialog from "@/components/SongSelectionDialog.vue";
import Song from "@/core/Song.js";

export default {
  name: "PlaylistEdit",
  components: {SongSelectionDialog},
  data() {
    return {
      showSongSelectionDialog: false,
      playlistId: null,
      // Playlist object (used for creating or updating a playlist)
      playlist: {
        id: null,
        name: "",
        description: "",
        songs: [], // List of songs in the playlist (will include song objects)
      },
      songHeaders: [
        { text: "Title", value: "title" },
        { text: "Artist", value: "artist" },
        { text: "Actions", value: "actions", align: "end" },
      ],
      isEditMode: false, // Determines if we're editing an existing playlist
      isValid: false, // Form validation status
      rules: {
        required: (value) => !!value || "This field is required",
      },
    };
  },
  mounted() {
    const playlistId = this.$route.params.id; // Assume route params contain `id`
    if (playlistId) {
      this.isEditMode = true;
      this.playlistId = playlistId;
      this.fetchPlaylist(playlistId);
      this.fetchSongs(playlistId);
    }
  },
  methods: {
    // Fetch playlist details for editing
    async fetchPlaylist(id) {
      try {
        const response = await fetch(
          urlProvider.getFullUrlForEndpoint(`Playlists/${id}`),
          { credentials: "include" }
        );

        if (response.status !== 200) {
          console.error("Failed to fetch playlist:", await response.text());
          return;
        }

        const data = await response.json();

        this.playlist.id = data.id;
        this.playlist.name = data.name;
        this.playlist.description = data.description;
      } catch (error) {
        console.error("Failed to fetch playlist:", error);
      }
    },

    async fetchSongs(id) {
      try {
        const response = await fetch(
          urlProvider.getFullUrlForEndpoint(`Playlists/${id}/Songs`),
          { credentials: "include" }
        );

        if (response.status !== 200) {
          console.error("Failed to fetch playlist:", await response.text());
          return;
        }

        this.playlist.songs = (await response.json()).map(s => new Song(s)) // Initialize as an array if missing
      } catch (error) {
        console.error("Failed to fetch playlist:", error);
      }
    },

    addSong() {
      this.showSongSelectionDialog = true;
    },

    // Remove a song from the playlist
    removeSong(song) {
      this.playlist.songs = this.playlist.songs.filter((s) => s.id !== song.id);
    },

    // Submit the form (for creating or updating a playlist)
    async submitForm() {
      const payload = {
        id: this.playlistId || undefined,
        name: this.playlist.name,
        description: this.playlist.description,
        songs: this.playlist.songs.map(s => s.toObject()), // Extract only song IDs
      };

      try {
        const url = urlProvider.getFullUrlForEndpoint(
          `Playlists${this.playlistId ? "/" + this.playlistId : ""}`
        );

        const response = await fetch(url, {
          method: this.isEditMode ? "PUT" : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.status !== 200) {
          console.error("Failed to submit playlist:", await response.text());
          return;
        }

        this.$router.push("/playlists"); // Redirect to the playlists list page
      } catch (error) {
        console.error("Failed to submit playlist:", error);
      }
    },

    async updateSongs(songs) {
      this.playlist.songs = songs;
    }
  },
};
</script>

<style scoped>
.my-4 {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
