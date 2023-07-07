<template>
  <b-navbar toggleable="lg" type="dark" class="custom-navbar">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-button
          id="demoButton"
          variant="primary"
          class="mb-3 mt-3"
          size="md"
          @click="loginDemo()"
          block

        >
          Demo
        </b-button>
        <b-popover target="demoButton" triggers="hover" placement="top">
          Próximamente
        </b-popover>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/login" button>Iniciar sesión</b-nav-item>
        <!-- Aquí puedes agregar otros elementos de navegación -->
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  middleware: "notAuthenticated",
  name: "Navbar",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      this.$axios
        .post("/login", this.user)
        .then((res) => {
          //success! - Usuario creado.
          if (res.data.status == "success") {
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Success! Welcome " + res.data.userData.name,
            });

            console.log(res.data);

            const auth = {
              token: res.data.token,
              userData: res.data.userData,
            };

            //token to de store - token a la tienda
            this.$store.commit("setAuth", auth);

            //set auth object in localStorage - Grabamos el token en localStorage
            localStorage.setItem("auth", JSON.stringify(auth));

            $nuxt.$router.push("/dashboard");

            return;
          }
        })
        .catch((e) => {
          console.log(e.response.data);

          if (e.response.data.error.errors.email.kind == "unique") {
            this.$notify({
              type: "danger",
              icon: "tim-icons icon-alert-circle-exc",
              message: "User already exists :(",
            });

            return;
          } else {
            this.$notify({
              type: "danger",
              icon: "tim-icons icon-alert-circle-exc",
              message: "Error creating user...",
            });

            return;
          }
        });
    },
    loginDemo() {
      //console.log("loginDemo")
      //this.user.email = "Demo@example.com"; // replace with demo email
      //this.user.password = "121212"; // replace with demo password
      //this.login();
    },
  },
};
</script>

<style scoped>
.custom-navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin: 0;
  background-color: transparent; /* Aquí hacemos la barra de navegación transparente */
}

/* Aquí hacemos las letras más anchas */
.custom-navbar a {
  font-weight: 800;
  color: #ffffff; /* Asegúrate de tener un color de texto que contraste con el fondo de la página */
}
</style>


