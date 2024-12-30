<template>
  <v-overlay
    v-model="show"
    :absolute="true"
    :z-index="9999"
    class="voice-overlay align-center justify-center"
  >
    <v-container
      class="d-flex align-center justify-center flex-column"
      style="background: rgba(0, 0, 0, 0.8); color: white;"
    >
      <v-row justify="center" align="center">
        <!-- Voice Command Prompt -->
        <h2>Listening for your command...</h2>
      </v-row>
      <v-row justify="center" align="center">
        <v-icon class="microphone-icon" size="64">mdi-microphone</v-icon>
      </v-row>
      <v-row justify="center" align="center">
        <!-- Transcribed command -->
        <h4 v-if="transcript" class="transcription">Command detected: {{ transcript }}</h4>
      </v-row>
      <v-row justify="center" align="center">
        <v-btn color="red lighten-1" @click="stopListening">Cancel</v-btn>
      </v-row>
    </v-container>
  </v-overlay>
</template>

<script>
import AlfredService from "@/core/AlfredService.js";
import SongsService from "@/core/SongsService.js";
import PlaylistsService from "@/core/PlaylistsService.js";
export default {
  name: "VoiceCommandOverlay",
  data() {
    return {
      show: false,       // Whether the overlay is visible
      transcript: "",    // Transcribed voice command
      recognition: null, // Speech recognition instance
    };
  },
  created() {
    this.initSpeechRecognition();

    // Add a global keydown listener for CTRL + G
    window.addEventListener("keydown", this.handleGlobalShortcut, false);
  },
  beforeUnmount() {
    // Remove global keydown listener when unmounted
    window.removeEventListener("keydown", this.handleGlobalShortcut, false);

    // Stop voice recognition if active
    if (this.recognition) {
      this.recognition.stop();
    }
  },
  methods: {
    // Initialize Web Speech API for speech recognition
    initSpeechRecognition() {
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = "en-US"; // Change language if needed

        // Process command transcription
        this.recognition.onresult = (event) => {
          const command = event.results[0][0].transcript;
          this.transcript = command; // Display the transcribed text
          this.processCommand(command); // Optionally, handle the command
        };

        // Reset overlay visibility/status on recognition ending
        this.recognition.onend = () => {
          this.show = false;
        };

        // Recognize errors
        this.recognition.onerror = (event) => {
          console.error("Speech Recognition Error:", event);
          this.show = false;
        };
      } else {
        console.error("Speech recognition is not supported by the browser.");
      }
    },

    // Display overlay and start listening
    startListening() {
      if (!this.recognition) {
        alert("Your browser doesn't support voice commands.");
        return;
      }

      this.transcript = ""; // Reset the transcription
      this.show = true;     // Make the overlay visible
      this.recognition.start(); // Start speech recognition
    },

    // Stop listening and hide overlay
    stopListening() {
      if (this.recognition) {
        this.recognition.stop();
      }
      this.show = false;
    },

    // Handle global key combination (CTRL + G)
    handleGlobalShortcut(event) {
      if (event.ctrlKey && event.key === "g") {
        event.preventDefault(); // Prevent default browser behavior
        this.startListening(); // Activate the voice command overlay
      }
    },

    // (Optional) Process voice command outputs
    async processCommand(command) {
      const songService = new SongsService()
      const playlistsService = new PlaylistsService(songService)
      const alfredService = new AlfredService(this.$router, playlistsService, songService)
      const parsedResp = await alfredService.ask(command)
      parsedResp.handler()
    },
  },
};
</script>

<style scoped>
/* Overlay Styling */
.voice-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Microphone Styling */
.microphone-icon {
  animation: pulse 1.5s infinite;
}

/* Pulse effect for the microphone */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Text */
.transcription {
  margin-top: 16px;
}
</style>
