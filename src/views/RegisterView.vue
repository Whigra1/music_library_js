<template>
<v-app>
  <v-main>
    <v-container fluid class="fill-height">
      <v-row>
        <v-col cols="10" sm="8" md="6" lg="4" xl="3" class="mx-auto">
          <v-card class="elevation-12 px-4 py-6" max-width="500">
            <v-card-title class="text-h5 justify-center">Register</v-card-title>

            <v-card-text>
              <v-form ref="form" v-model="isFormValid">
                <!-- Name and Surname in One Row -->
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="name"
                      label="First Name"
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="surname"
                      label="Last Name"
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <!-- Email -->
                    <v-text-field
                      v-model="email"
                      label="Email"
                      type="email"
                      required
                      :rules="[rules.required, rules.email]"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="phoneNumber"
                      label="Phone number"
                      required
                      :rules="[rules.required]"
                    />
                  </v-col>
                </v-row>


                <!-- Date of Birth -->
                <v-text-field
                  v-model="dob"
                  label="Date of Birth"
                  placeholder="YYYY-MM-DD"
                  required
                  type="date"
                  :rules="[rules.required, rules.date]"
                />

                <!-- Login -->
                <v-text-field
                  v-model="login"
                  label="Login"
                  required
                  :rules="[rules.required]"
                />

                <!-- Password -->
                <v-text-field
                  v-model="password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  :rules="[rules.required, rules.password]"
                  append-icon="mdi-eye-off"
                  @click:append="showPassword = !showPassword"
                />

                <!-- Confirm Password -->
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirm Password"
                  :type="confirmShowPassword ? 'text' : 'password'"
                  required
                  :rules="[rules.required, rules.matchPassword]"
                  @click:append="confirmShowPassword = !confirmShowPassword"
                  append-icon="mdi-eye-off"
                />
              </v-form>
            </v-card-text>

            <v-card-actions style="padding-left: 3%; padding-right: 12%;">
              <v-btn
                variant="outlined"
                :to="{ name: 'login' }"
              >
                Back to Login
              </v-btn>
              <v-spacer/>
              <v-btn
                width="125px"
                variant="outlined"
                color="primary"
                :disabled="!isFormValid"
                @click="onSubmit"
              >
                Register
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</v-app>
</template>

<script>
import urlProvider from "@/providers/UrlProvider.js";

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      surname: '',
      email: '',
      dob: new Date(), // Date of Birth
      login: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      isFormValid: false,
      showPassword: false,
      confirmShowPassword: false,
      rules: {
        required: (value) => !!value || 'This field is required',
        email: (value) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Enter a valid email',
        date: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) || 'Enter a valid date (YYYY-MM-DD)',
        password: (value) =>
          (value && value.length >= 6) || 'Password must be at least 6 characters long',
        matchPassword: (value) => value === this.password || 'Passwords must match',
      },
    }
  },
  methods: {
    async onSubmit() {
      if (this.$refs.form.validate()) {
        const userData = {
          firstName: this.name,
          secondName: this.surname,
          email: this.email,
          userName: this.login,
          password: this.password,
          dateOfBirth: this.dob,
        }

        try {
          const res = await fetch(urlProvider.getBaseUrl() + '/Authentication/signup', {
            method: 'POST',
            credentials: 'include',
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify(userData)
          })
          if (res.status === 200) {
            this.$router.push({ path: '/' })
          }
        } catch (e) {
          console.error(e)
        }
      }
    },
  },
}
</script>

<style scoped>
/* Add some custom styling if needed */
</style>
