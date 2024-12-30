<template>
<v-container class="py-4">
  <v-card class="elevation-4">
    <v-card-title>
        <span class="text-h6">
          {{ isEditMode ? 'Edit Song' : 'Upload New Song' }}
        </span>
    </v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="isValid" @submit.prevent="submitForm">
        <!-- Song Title -->
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              label="Artist"
              v-model="song.artist"
              variant="outlined"
              :rules="[rules.required]"
              required
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="Title"
              v-model="song.title"
              variant="outlined"
              :rules="[rules.required]"
              required
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <v-textarea
              label="Description"
              v-model="song.description"
              variant="outlined"
              :rules="[rules.required]"
              rows="3"
              clearable
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6">
            <v-textarea
              label="Lyrics"
              v-model="song.lyrics"
              variant="outlined"
              rows="3"
              clearable
            ></v-textarea>
          </v-col>
        </v-row>

        <v-data-table
          :headers="fileHeaders"
          :items="song.files"
          class="my-4"
          dense
        >
          <template #top>
            <v-toolbar flat class="d-flex justify-space-between">
              <v-toolbar-title>Attached song formats</v-toolbar-title>
              <v-btn
                color="primary"
                variant="text"
                @click="showUploadDialog = true"
              >
                Upload Files
              </v-btn>
            </v-toolbar>
          </template>
          <template #item.name="{ item }">
            <span>{{ item.name }}</span>
          </template>
          <template #item.actions="{ item }">
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" variant="flat">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="deleteFile(item)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>

        <!-- Submit Button -->
        <v-btn color="primary" :disabled="!isValid" @click="submitForm">
          {{ isEditMode ? 'Update Song' : 'Upload Song' }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
  <v-snackbar v-model="successSnackbar" :timeout="3000" top>
    Profile successfully updated!
  </v-snackbar>
</v-container>
<upload-file-dialog
  v-model="showUploadDialog"
  @upload-files="handleUploadedFiles"
/>
</template>
<script>
import urlProvider from "@/providers/UrlProvider.js";
import UploadFileDialog from "@/components/UploadFileDialog.vue";
export default {
  name: 'NewOrEditSong',
  components: { UploadFileDialog },
  data() {
    return {
      successSnackbar: false,
      showUploadDialog: false,
      songId: null,
      // Song object (used for creating or updating the song)
      song: {
        id: null,
        artist: '',
        title: '',
        description: '',
        files: [],
      },
      fileHeaders: [
        { text: "Name", value: "name" },
        { text: "Actions", value: "actions", align: 'end' },
      ],
      files: [], // Stores uploaded files
      isEditMode: false, // Determines if we're editing an existing song
      isValid: false, // Form validation status
      rules: {
        required: (value) => !!value || 'This field is required',
      },
    };
  },
  mounted() {
    // Check if this is edit mode (based on route params)
    const songId = this.$route.params.id; // Assume route params contain `id`
    if (songId) {
      this.isEditMode = true;
      this.songId = songId;
      this.fetchSong(songId);
      this.fetchFiles();

    }
  },
  methods: {
    // Fetch song details for editing
    async fetchSong(id) {
      try {
        const res = await fetch(urlProvider.getFullUrlForEndpoint(`Songs/${id}`), {
          credentials: 'include'
        })

        if (res.status !== 200) {
          console.error('Failed to fetch song:', await res.text());
          return
        }

        const data = await res.json()

        this.song.id = data.id;
        this.song.artist = data.artist;
        this.song.title = data.title;
        this.song.description = data.description;
        // Note: Files won't be pre-filled for security reasons
      } catch (error) {
        console.error('Failed to fetch song:', error);
        // Handle error (e.g., show an error message)
      }
    },

    async fetchFiles() {
      try {
        const res = await fetch(urlProvider.getFullUrlForEndpoint(`Songs/${this.songId}/Files`), {
          credentials: 'include'
        })

        if (res.status !== 200) {
          console.error('Failed to fetch song:', await res.text());
          return
        }

        const data = await res.json()
        this.song.files = data.map(file => ({
          id: file.id,
          name: file.path.split('/').pop(),
        }))

        // Note: Files won't be pre-filled for security reasons
      } catch (error) {
        console.error('Failed to fetch song:', error);
        // Handle error (e.g., show an error message)
      }
    },

    // Submit the form (for creating or updating a song)
    async submitForm() {
      const formData = new FormData();
      formData.append('artist', this.song.artist);
      formData.append('title', this.song.title);
      formData.append('description', this.song.description);

      // Attach all uploaded files to the FormData
      this.files.forEach((file) => {
        formData.append('files', file);
      });

      try {

        const url = urlProvider.getFullUrlForEndpoint(`Songs${this.songId ? '/' + this.songId : ''}`)

        const res = await fetch(url, {
          method: this.isEditMode ? 'PUT' : 'POST',
          credentials: 'include',
          // headers: new Headers({'content-type': 'multipart/form-data'}),
          body: formData
        })

        if (res.status !== 200) {
          console.error('Failed to submit form:', await res.text());
          return
        }

        if (!this.isEditMode) {
          this.$router.push('/library'); // Redirect to the song list page
        }
        this.successSnackbar = true;
      } catch (error) {
        console.error('Failed to submit form:', error);
        // Handle error (e.g., show a message)
      }
    },

    async handleUploadedFiles(newFiles) {
      for (const file of newFiles) {
        this.files.push(file)
        this.song.files.push({
          id: null,
          name: file.name
        })
      }
    },

    async deleteFile (file) {
      if (file.id === null) {
        this.song.files = this.song.files.filter(f => f !== file)
      }
      try {
        const res = await fetch(urlProvider.getFullUrlForEndpoint(`Files/${file.id}`), {
          credentials: 'include',
          method: 'DELETE'
        })

        if (res.status !== 200) {
          console.error('Failed to delete file: ', await res.text());
          return
        }
        await this.fetchFiles()
      } catch (error) {
        console.error('Failed to delete file: ', error.message);
      }

    },

    // Format file size for display
    formatFileSize(bytes) {
      const sizes = ["Bytes", "KB", "MB", "GB"];
      if (bytes === 0) return "0 Bytes";
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
      return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    },
  },
}
</script>
