<template>
<v-card outlined>
  <v-list dense>
    <v-list-item
      @click="openNewChatDialog">
      <v-list-item-title>Add new chat</v-list-item-title>
    </v-list-item>
    <v-list-item
      v-for="chat in chats"
      :key="chat.id"
      :value="chat.id"
      @click.exact="onSelectChat(chat.id)"
      :class="{ 'chat-selected': chat.id === selectedChatId }"
    >
        <v-list-item-title>{{ chat.name }}</v-list-item-title>
      <template #append>
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn flat icon v-bind="props">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <!-- Menu Option: Clear Chat -->
            <v-list-item @click="() => {}">
              <v-list-item-title>Clear Chat</v-list-item-title>
            </v-list-item>
            <!-- Menu Option: Delete Chat -->
            <v-list-item @click="() => {}">
              <v-list-item-title>Delete Chat</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-list-item>
  </v-list>
</v-card>
<v-dialog v-model="newChatDialog" max-width="500px">
  <v-card>
    <v-card-title class="headline">Create a New Chat</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="newChatName"
        variant="outlined"
        label="Chat Name"
        placeholder="Enter chat name"
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="cancelNewChat">Cancel</v-btn>
      <v-btn color="primary" @click="createChat">Create</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: 'ChatList',
  props: {
    chats: {
      type: Array,
      required: true,
    },
    selectedChatId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      newMessage: "", // Text input for new chat messages
      newChatDialog: false, // Controls the visibility of the "New Chat" dialog
      newChatName: "",
    }
  },
  methods: {
    onSelectChat(chatId) {
      this.$emit('selectChat', chatId);
    },
    openNewChatDialog() {
      this.newChatName = ""; // Clear chat name field
      this.newChatDialog = true; // Open the dialog
    },
    cancelNewChat() {
      this.newChatDialog = false; // Close the dialog without saving
    },
    createChat() {
      const newChatName = this.newChatName.trim();
      if (newChatName) {
        // Pass the new chat name to parent for processing
        this.$emit("createNewChat", this.newChatName);

        // Reset dialog state
        this.newChatDialog = false;
        this.newChatName = "";
      } else {
        alert("Please provide a name for the new chat.");
      }
    },

  },
}
</script>



<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 1rem;
  cursor: pointer;
}

li.selected {
  background-color: #f0f0f0;
  font-weight: bold;
}
</style>
