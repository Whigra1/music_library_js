<template>
<v-dialog v-model="isOpen" max-width="600px">
  <v-card>
    <v-card-title class="d-flex justify-space-between align-center" >
      <div class="text-h5 text-medium-emphasis ps-2">
        Upload files
      </div>
      <v-btn
        icon="mdi-close"
        variant="flat"
        @click="closeDialog"
      />
    </v-card-title>

    <v-card-text>
      <v-file-input
        v-model="files"
        label="Select files to upload"
        multiple
        show-size
        clearable
        variant="outlined"
      />
      <v-list two-line>
        <template
          v-for="(file, index) in files"
          :key="index"
        >
          <v-list-item>
            <v-list-item-title>{{ file.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ formatFileSize(file.size) }}</v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-list>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" :disabled="files.length === 0" @click="confirmUpload">
        Upload
      </v-btn>
      <v-btn text @click="closeDialog">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: "UploadFileDialog",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false, // Controls the dialog visibility locally
      files: [], // The selected files
    };
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.isOpen = newValue;
      },
    },
    isOpen(newValue) {
      this.$emit("update:modelValue", newValue);
    },
  },
  methods: {
    // Formats the file size for UI
    formatFileSize(bytes) {
      const units = ["Bytes", "KB", "MB", "GB"];
      if (bytes === 0) return "0 Bytes";
      const index = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
    },
    // Emits selected files to the parent component when confirmed
    confirmUpload() {
      this.$emit("upload-files", this.files);
      this.closeDialog();
    },
    // Closes the dialog and resets files
    closeDialog() {
      this.files = [];
      this.isOpen = false;
    },
  },
};
</script>

<style scoped>
/* Add custom styles here if needed */
</style>
