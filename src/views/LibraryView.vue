<template>
<v-container class="py-4">
  <v-tabs v-model="tab">
    <v-tab :value="1">
      Songs
    </v-tab>
    <v-tab :value="2">
      Playlists
    </v-tab>
  </v-tabs>

  <v-window v-model="tab">
    <v-window-item :value="1">
      <Songs />
    </v-window-item>
    <v-window-item :value="2">
      <Playlists />
    </v-window-item>
  </v-window>

</v-container>
</template>

<script>
import Songs from "@/components/music/Songs.vue";
import Playlists from "@/components/music/Playlists.vue";

export default {
  name: "StyledList",
  components: {Playlists, Songs},
  data() {
    return {
      tab: 1,
    };
  },

  mounted() {
    const query = this.$route.query || {};
    if (query.tab === 'playlists') {
      this.tab = 2;
    }
  },

  methods: {
    playSong (song) {

    },
  },
};
</script>

<style scoped>
.song-title {
  font-weight: bold;
}

.author-name {
  color: gray;
}

/* Adjust padding or alignment, if needed */
.v-list-item {
  align-items: center;
}
</style>
