<template>
<v-container>
  <!-- Page Header -->
  <v-row class="my-4" align="center" justify="space-between">
    <v-col cols="12" sm="6">
      <!-- Search Bar -->
      <v-text-field
        v-model="searchQuery"
        label="Search playlists"
        hide-details
        clearable
        density="compact"
        variant="outlined"
        append-icon="mdi-magnify"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="3" class="text-center">
      <!-- Add New Playlist Button -->
      <v-btn color="primary" @click="createNewPlaylist" elevation="2">
        Create New Playlist
      </v-btn>
    </v-col>
  </v-row>

  <!-- Playlist List -->
  <v-card class="elevation-4">
    <v-list lines="two" nav>
      <template v-for="(playlist, index) in filteredPlaylists" :key="playlist.id">
        <v-list-item>
          <!-- Playlist Name -->
          <v-list-item-title>{{ playlist.name }}</v-list-item-title>
<!--          <v-list-item-subtitle>{{ (playlist.playlistSongs || []).length }} songs</v-list-item-subtitle>-->

          <!-- Actions -->
          <v-list-item-action>
            <v-btn color="primary" variant="text" @click="viewPlaylist(playlist)">View</v-btn>
          </v-list-item-action>
          <template #append>
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" variant="flat">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="editPlaylist(playlist)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deletePlaylist(playlist)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-list-item>

        <!-- Divider -->
        <v-divider v-if="index < playlists.length - 1"></v-divider>
      </template>
    </v-list>
  </v-card>
</v-container>
</template>

<script>
import PlaylistsService from "@/core/PlaylistsService.js";

export default {
  name: "Playlists",
  data() {
    return {
      playlists: [],
      searchQuery: "",
    };
  },
  computed: {
    filteredPlaylists() {
      if (!this.searchQuery) {
        return this.playlists;
      }
      return this.playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async loadPlaylists() {
      try {
        const playlistService = new PlaylistsService();
        this.playlists = await playlistService.loadPlaylists();
      } catch (error) {
        console.error("Failed to load playlists:", error);
      }
    },
    createNewPlaylist() {
      this.$router.push({ path: "/playlist-edit" });
    },
    editPlaylist(playlist) {
      this.$router.push({ path: `/playlist-edit/${playlist.id}` });
    },
    viewPlaylist(playlist) {
      this.$router.push({ path: `/playlist/${playlist.id}` });
    },
    async deletePlaylist(playlist) {
      if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
        try {
          const playlistService = new PlaylistsService();
          await playlistService.deletePlaylist(playlist.id);
          this.playlists = this.playlists.filter((p) => p.id !== playlist.id);
        } catch (error) {
          console.error("Failed to delete playlist:", error);
        }
      }
    },
  },
  async created() {
    await this.loadPlaylists();
  },
};
</script>

<style scoped>
.my-4 {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>
