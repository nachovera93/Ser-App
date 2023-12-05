<template>
  <div class="container login-page">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <card class="card-login card-white">
        <template slot="header">
          <img src="img//card-primary.png" alt="" />
          <h1 class="card-title">IoT SER   </h1>
        </template>

        <div>
          <base-input
            name="email"
            v-model="user.email"
            placeholder="Email"
            addon-left-icon="tim-icons icon-email-85"
          >
          </base-input>

          <base-input
            name="password"
            v-model="user.password"
            type="password"
            placeholder="Password"
            addon-left-icon="tim-icons icon-lock-circle"
          >
          </base-input>
        </div>

        <div slot="footer">
          <base-button
            native-type="submit"
            type="primary"
            class="mb-3"
            size="lg"
            @click="login()"
            block
          >
            Entrar
          </base-button>
          <!-- <div class="pull-left">
            <h6>
              <nuxt-link class="link footer-link" to="/register">
                Crear cuenta
              </nuxt-link>
            </h6>
          </div> -->

          <div class="pull-right">
            <h6><a href="/home" class="link footer-link">Home</a></h6>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware: 'notAuthenticated',
  name: "login-page",
  layout: "auth",
  data() {
    return {
      user: {
        email: "",
        password: ""
      }
    };
  },
  mounted() {

  },
  methods: {
    login() {
  console.log("Login Front"); // Log when login method starts
  this.$axios
    .post("/login", this.user)
    .then(res => {
      console.log("Login response:", res); // Log the response from the server

      // If login was successful
      if (res.data.status == "success") {
        this.$notify({
          type: "success",
          icon: "tim-icons icon-check-2",
          message: "Success! Welcome " + res.data.userData.name
        });

        const auth = {
          token: res.data.token,
          userData: res.data.userData
        };

        // Log the auth object
        console.log("Auth object:", auth);

        // Set auth object in store and local storage
        this.$store.commit('setAuth', auth);
        localStorage.setItem('auth', JSON.stringify(auth));

        // Redirect to dashboard
        $nuxt.$router.push('/dashboard');
      }
    })
    .catch(e => {
      // Log any error response from the server
      console.error("Login error:", e.response ? e.response.data : e);

      // Handle unique email error
      if (e.response && e.response.data.error.errors.email.kind == "unique") {
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "User already exists :("
        });
      } else {
        // Handle generic error
        this.$notify({
          type: "danger",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error on login..."
        });
      }
    });
}

  }
};
</script>

<style>
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
</style>
