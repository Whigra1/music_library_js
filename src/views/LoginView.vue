<template>
<v-container fluid class="fill-height">
  <v-row>
    <v-col cols="10" sm="8" md="6" lg="4" xl="3" class="mx-auto">
      <v-card class="elevation-12 px-4 py-6">
        <v-card-title class="text-h5justify-center">Login</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="tryLogin">
            <v-row>
              <v-col>
                <v-text-field
                  v-model="login"
                  type="text"
                  variant="outlined"
                  label="Username"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="password"
                  type="password"
                  variant="outlined"
                  label="Password"
                />
              </v-col>
            </v-row>
          </v-form>
          <div class="register-link">
            <router-link to="/register">Don't have an account? Register here</router-link>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="tryLogin">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</v-container>

</template>

<script>
import urlProvider from "@/providers/UrlProvider.js";
import { useUserStore } from "@/stores/userStore.js";
export default {
  name: 'LoginView',
  data() {
    return {
      login: '',
      password: ''
    }
  },
  methods: {
    async tryLogin() {
      let res = await fetch(urlProvider.getBaseUrl() + '/Authentication/auth', {
        method: 'POST',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          userName: this.login,
          password: this.password
        })
      })

      if (res.status !== 200) {
        console.error("Something wrong")
        return
      }

      res = await fetch(urlProvider.getBaseUrl() + '/Authentication/user', {
        method: 'GET',
        credentials: 'include',
        headers: new Headers({'content-type': 'application/json'}),
      })

      useUserStore().setInfo(await res.json())

      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style scoped>
</style>
