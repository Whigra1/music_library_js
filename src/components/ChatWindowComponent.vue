<template>
<v-container fluid class="pa-0 d-flex flex-column">
  <v-row style="width: 100%;">
    <v-col class="d-flex">
      <v-virtual-scroll height="600px" :items="messages">
        <template #default="{ item: message }">
          <div
            class="message-container"
            :class="{
              'message-user': message.userId === userInfo.id,
              'message-bot': message.userId !== userInfo.id,
            }"
          >
            <div class="message">
              {{ message.text }}
            </div>
          </div>
        </template>
      </v-virtual-scroll>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <div class="input-section pa-4 d-flex align-center">
        <v-text-field
          v-model="newMessage"
          placeholder="Send a message..."
          hide-details
          dense
          variant="outlined"
          class="flex-grow-1"
          @keyup.enter="sendMessage"
        ></v-text-field>

        <!-- Microphone Button -->
        <v-btn
          color="primary"
          class="ml-2"
          elevation="2"
          fab
          small
          @click="toggleRecording"
          :class="{ 'recording': isRecording }"
        >
          <v-icon>{{ isRecording ? 'mdi-microphone-off' : 'mdi-microphone' }}</v-icon>
        </v-btn>

        <!-- Send Button -->
        <v-btn
          color="primary"
          class="ml-3"
          elevation="2"
          fab
          small
          @click="sendMessage"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-col>
  </v-row>

</v-container>

<yes-no-dialog
  v-model="navigationConfirmDialog"
  title="Leave chat?"
  message="Are you sure you want to move to another page?"
  @yes="handleNavigation"
  @no="navigationConfirmDialog = false; this.handler=() => {}"
/>

</template>

<script>
import {useUserStore} from "@/stores/userStore.js";
import ChatService from "@/core/ChatService.js";
import YesNoDialog from "@/components/YesNoDialog.vue";
import PlaylistsService from "@/core/PlaylistsService.js";
import SongsService from "@/core/SongsService.js";
import AlfredService from '@/core/AlfredService.js'


export default {
  name: "ChatWindow",
  components: {YesNoDialog},
  props: {
    chatId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      navigationConfirmDialog: false,
      handler: () => {},
      userInfo: {},
      messages: [],
      newMessage: "",
      isRecording: false, // Track recording status
      recognition: null,  // Speech recognition instance
    };
  },
  async mounted() {
    if (this.chatId) {
      await this.loadChat(this.chatId);
    }

    this.userInfo = useUserStore().userInfo

    this.initSpeechRecognition();
  },
  watch: {
    chatId: {
      immediate: true,
      handler (newValue) {
        this.loadChat(newValue)
      },
    }
  },
  emits: ['recording'],
  methods: {
    handleNavigation() {
      this.handler()
    },

    initSpeechRecognition() {
      if ("webkitSpeechRecognition" in window) {
        this.recognition = new webkitSpeechRecognition();
        this.recognition.lang = "en-US"; // Optional: Set language

        // Event: Update `newMessage` as user speaks
        this.recognition.onresult = (event) => {
          this.newMessage = event.results[0][0].transcript;
        };

        // Event: Reset active recording on stop/cancel
        this.recognition.onend = (event) => {
          this.isRecording = false;
          this.$emit('recording', false)
        };
      } else {
        console.error("Speech recognition not supported in this browser.");
      }
    },


    toggleRecording() {
      if (!this.recognition) {
        alert("Your browser doesn't support voice recording.");
        return;
      }

      this.$emit('recording', true)

      if (this.isRecording) {
        // Stop recording
        this.recognition.stop();
        this.isRecording = false;
      } else {
        // Start recording
        this.recognition.start();
        this.isRecording = true;
      }
    },

    async loadChat(chatId) {
      if (!chatId) return;
      const chatService = new ChatService();
      const res = await chatService.loadChat(chatId);
      this.messages = res.messages;
    },

    async sendMessage() {
      const newMessage = this.newMessage.trim();
      if (!newMessage) return;
        // Add user's message
      this.messages.push({ sender: "user", text: this.newMessage });
      this.newMessage = "";

      this.messages.push({
        userId: -99,
        sender: "ai",
        text: "That's interesting! Let me think about it...",
      });

      const chatService = new ChatService();
      const resp = await chatService.sendMessage({
        chatId: this.chatId,
        text: newMessage
      })
      if (resp) {
        await this.loadChat(this.chatId)
      }

      const songService = new SongsService()
      const alfredService = new AlfredService(this.$router, new PlaylistsService(songService), songService)

      const parsedResp = alfredService.parseResponse(resp)

      this.handler = parsedResp.handler
      if (parsedResp.type === 'navigation') {
        this.navigationConfirmDialog = true;
        return
      }
      this.handler()
    }
  },
};
</script>

<style scoped>
/* Container for chat messages */
.messages-container {
  padding: 16px;
  background-color: #f7f7f8; /* ChatGPT-style background */
  overflow-y: auto; /* Allows scrolling for overflowing content */
  scrollbar-width: thin; /* Thin scrollbar for better look */
}

/* Message alignment and bubble styles */
.message-container {
  display: flex;
  margin-bottom: 12px;
}

.message-user {
  justify-content: flex-end; /* User messages to the right */
}

.message-bot {
  justify-content: flex-start; /* Bot messages to the left */
}

.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-user .message {
  background-color: #0078ff; /* Blue for user */
  color: white;
}

.message-bot .message {
  background-color: #e6e6e6; /* Gray for bot */
  color: black;
}

/* Input Section Stuck to Bottom */
.input-section {
  background-color: white;
  border-top: 1px solid #e0e0e0; /* Divider from the chat area */
  position: sticky; /* Sticks input section to the bottom */
  bottom: 0;
  z-index: 10; /* Ensures it stays on top of the messages */
}

/* Round text field and button in input section */
.input-section v-text-field {
  border-radius: 20px;
}

.input-section v-btn {
  background-color: #0078ff;
  color: white;
}

/* Responsive Design for Mobile Screens */
@media (max-width: 768px) {
  .message {
    max-width: 100%; /* Full width bubbles on smaller screens */
  }
}
</style>
