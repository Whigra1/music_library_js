<template>
  <v-dialog v-model="isOpen" max-width="400px">
    <v-card>
      <v-card-title class="text-h5">{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red"  variant="text" @click="handleNo">No</v-btn>
        <v-btn color="green" variant="text" @click="handleYes">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "YesNoDialog",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Confirm Action",
    },
    message: {
      type: String,
      default: "Are you sure you want to proceed?",
    },
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
  emits: ["update:modelValue", "yes", "no"],

  data() {
    return {
      isOpen: false,
    }
  },

  methods: {
    handleYes() {
      this.$emit("yes");
      this.closeDialog();
    },
    handleNo() {
      this.$emit("no");
      this.closeDialog();
    },
    closeDialog() {
      this.$emit("update:visible", false);
    },
  },
};
</script>
