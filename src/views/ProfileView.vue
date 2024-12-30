<template>
<v-container>
  <v-row>
    <v-col>
      <h1>Profile</h1>
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-text-field
        v-model="profile.email"
        label="First Name"
        readonly
        variant="outlined"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="profile.firstName"
        label="First Name"
        required
        variant="outlined"
        :rules="[rules.required]"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        v-model="profile.lastName"
        label="Last Name"
        required
        variant="outlined"
        :rules="[rules.required]"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="profile.dateOfBirth"
        label="Date of Birth"
        variant="outlined"
        type="date"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="profile.phoneNumber"
        label="Phone Number"
        required
        variant="outlined"
        :rules="[rules.phoneNumber]"
      />
    </v-col>
    <v-col cols="12">
      <v-btn color="primary" @click="saveProfile">Save Profile</v-btn>
      <v-btn @click="resetProfile">Reset</v-btn>
    </v-col>
  </v-row>
  <v-snackbar v-model="successSnackbar" :timeout="3000" top>
    Profile successfully updated!
  </v-snackbar>
</v-container>
</template>

<script>
import {useUserStore} from "@/stores/userStore.js";
import urlProvider from "@/providers/UrlProvider.js";
export default {
  name: "ProfileView",
  mounted() {
    this.resetProfile()
  },
  data() {
    return {
      profile: {
        firstName: "",
        lastName: "",
        dateOfBirth: '',
        phoneNumber: "",
        email: "",
      },
      successSnackbar: false,
      datePickerMenu: false,
      rules: {
        required: (value) => !!value || "Required.",
        phoneNumber: (value) =>
          /^\d{10,15}$/.test(value) || "Enter a valid phone number.",
      },
    };
  },

  methods: {
    async saveProfile() {

      const url = urlProvider.getFullUrlForEndpoint('Users')

      const res = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(this.profile)
      })
      if (res.status !== 200) {
        console.error("Something wrong")
        return
      }
      const store = useUserStore()
      store.setInfo(
        {
          ...this.profile,
        }
      )
      console.log("Profile saved:", this.profile);
      this.successSnackbar = true;
    },
    resetProfile() {
      const store = useUserStore()
      Object.assign(this.profile, store.userInfo)
    },
  },
};
</script>

<style scoped>
/* Add styles as needed */
</style>
