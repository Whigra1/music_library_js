<template>
  <v-container class="d-flex justify-center align-center">
    <h3>{{ songName }}</h3>
    <v-btn :disabled="!hasPrev" icon @click="prev()">
      <v-icon>mdi-skip-previous</v-icon>
    </v-btn>
    <v-btn icon @click="playing ? pause() : play()">
      <v-icon>{{ playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
    </v-btn>
    <v-btn :disabled="!hasNext" icon @click="next()">
      <v-icon>mdi-skip-next</v-icon>
    </v-btn>
  </v-container>
</template>


<script>
import audioPlayer from "@/core/AudioPlayer.js";
export default {
  name: "AudioPlayer",
  data() {
    return {
      songName: '',
      playing: false,
      hasPrev: false,
      hasNext: false
    }
  },
  mounted() {
    audioPlayer.on('play', () => {
      this.playing = true;
      this.updateButtons();
    });
    audioPlayer.on('pause', () => {
      this.playing = false;
      this.updateButtons();
    });
  },
  methods: {
    updateButtons() {
      this.songName = audioPlayer.getSongTitle() || ''
      this.hasPrev = audioPlayer.hasPrev();
      this.hasNext = audioPlayer.hasNext();
    },

    prev() {
      audioPlayer.prev();
      this.updateButtons();
    },
    next() {
      audioPlayer.next();
      this.updateButtons();
    },
    play() {
      audioPlayer.play();
    },
    pause () {
      audioPlayer.pause();
    }
  }
}
</script>


<style scoped>

</style>
