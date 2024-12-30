<template>
<v-container fluid class="fill-height pt-3" style="max-height: 800px;">
  <v-row justify="center"  class="full-height">
    <!-- Left Side: Chat List -->
    <v-col cols="3" class="chat-list pa-0">
      <ChatList
        :chats="chats"
        :selectedChatId="selectedChatId"
        @selectChat="selectChat"
        @createNewChat="createNewChat"
      />
    </v-col>

    <!-- Center: Chat Window -->
    <v-col cols="6" class="chat-window d-flex flex-column">
      <ChatWindow
        @recording="handleRecording"
        :chatId="selectedChatId"
      />
    </v-col>

    <!-- Right Side: AI Model -->
    <v-col cols="3" class="ai-model pa-0">
      <AIModel :animation="currentAnimation"/>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import ChatList from "@/components/ChatListComponent.vue";
import ChatWindow from "@/components/ChatWindowComponent.vue";
import AIModel from "@/components/AIModel.vue";

const ANIMATIONS = {
  EXPLAIN: 1,
  HELLO: 2,
  LISTENING: 3
}

import ChatService from "@/core/ChatService.js";
export default {
  name: "ChatView",
  components: {
    ChatList,
    ChatWindow,
    AIModel,
  },
  data() {
    return {
      ANIMATIONS,
      currentAnimation: ANIMATIONS.HELLO,
      selectedChatId: null, // ID of the currently selected chat
      chats: [], // List of chats
    };
  },

  async mounted() {
    this.chats = await this.loadChats()
    if (this.chats.length > 0) {
      this.selectChat(this.chats[0].id)
    }
  },

  methods: {

    async loadChats() {
      const chatService = new ChatService();
      return chatService.loadChats();
    },

    selectChat(id) {
      this.selectedChatId = id;
    },
    createNewChat (name) {
      const chatService = new ChatService();
      const chat = chatService.createChat({ name })
      if (chat) {
        this.selectChat(chat.id)
      }
    },
    handleRecording(recording) {
      console.log(recording)
      this.currentAnimation = recording ? ANIMATIONS.LISTENING : ANIMATIONS.HELLO;
    }
  },
};
</script>

<style scoped>
.full-height {
  height: 100vh;
}
.chat-list {
  border-right: 1px solid #ccc;
  overflow-y: auto;
}
.chat-window {
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  overflow-y: auto;
}
.ai-model {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
