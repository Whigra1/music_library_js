<template>
  <v-dialog v-model="isOpen" max-width="800px">
    <v-card>
      <!-- Dialog Title -->
      <v-card-title class="d-flex justify-space-between align-center" >
        <div class="text-h5 text-medium-emphasis ps-2">
          Select songs
        </div>
        <v-btn
          icon="mdi-close"
          variant="flat"
          @click="closeDialog"
        />
      </v-card-title>

      <!-- Song Selection Table -->
      <v-card-text>
        <v-data-table
          v-model="selectedSongs"
          :headers="songHeaders"
          :items="songs"
          item-value="id"
          show-select
          dense
          class="elevation-1"
        >
          <template #item.order="{ item }">
            <v-text-field
              v-model="item.order"
              type="number"
              hide-spin-buttons
              min="1"
              class="order-input"
              variant="outlined"
              hide-details
              dense
            ></v-text-field>
          </template>
          <template #item.actions="{ item }">
            <v-btn flat icon @click="removeSong(item)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions>
        <v-btn outlined color="primary" @click="saveSelection">
          Save
        </v-btn>
        <v-btn text color="grey" @click="closeDialog">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SongsService from "@/core/SongsService.js";

export default {
  name: "SongSelectionDialog",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    playlistSongs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isOpen: false,
      songs: [], // All songs available
      selectedSongs: [], // Tracks selected songs
      songHeaders: [
        { text: "Title", value: "title", align: "start" },
        { text: "Artist", value: "artist" },
        { text: "Order", value: "order", align: "center" },
        { text: "Actions", value: "actions", align: "end" },
      ],
    };
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.isOpen = newValue;
      },
    },
    isOpen(val) {
      this.$emit("update:modelValue", val);
    },
  },
  mounted() {
    this.loadSongs();
  },
  methods: {
    async loadSongs() {
      try {
        const songService = new SongsService();
        this.songs = await songService.loadSongs();
        // For ordering, add a default `order` field to all songs
        this.songs.forEach((song) => {
          song.order = null;
        });

        // Pre-select existing playlistSongs:
        this.playlistSongs.forEach((playlistSong) => {
          const match = this.songs.find((s) => s.id === playlistSong.id);
          if (match) {
            match.order = playlistSong.order || null;
            this.selectedSongs.push(match);
          }
        });
      } catch (error) {
        console.error("Failed to load songs:", error);
      }
    },
    saveSelection() {
      // Emit the selected songs with their order

      const selectedSongIds = Object.values(this.selectedSongs)

      const orderedSelection = this.songs.filter((song) => selectedSongIds.includes(song.id));

      orderedSelection.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));

      this.$emit("save", orderedSelection);
      this.closeDialog();
    },
    removeSong(item) {
      // Deselect a song
      this.selectedSongs = this.selectedSongs.filter((song) => song.id !== item.id);
    },
    closeDialog() {
      this.isOpen = false;
    },
  },
};
</script>

<style scoped>
.order-input {
  max-width: 60px;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield; /* For Firefox */
}
</style>
