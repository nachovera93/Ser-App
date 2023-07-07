<template>
  <div class="container-fluid login-page">
    <Navbar class="w-100"></Navbar>

    <div class="w-100" v-if="windowWidth > 800">
      <!-- Carousel para las imágenes en móvil-->
      <img
        :src="require('@/assets/IOTSEr_transparente.svg')"
        alt="Descripción de la imagen"
        style="width: 100%"
      />
    </div>
    <div v-else>
      <img
        :src="require('@/assets/FondoPhone.svg')"
        alt="Descripción de la imagen"
        style="width: 100%"
      />
    </div>

    <div v-if="windowWidth > 800">
      <!-- Carousel para las imágenes en móvil-->
      <img
        :src="require('@/assets/Portada_2.svg')"
        alt="Descripción de la imagen"
        style="width: 100%"
      />
    </div>
    <div v-else>
      <img
        :src="require('@/assets/1.svg')"
        alt="Descripción de la imagen"
        style="width: 100%"
      />
      <img
        :src="require('@/assets/2__.svg')"
        alt="Descripción de la imagen"
        style="width: 100%"
      />
    </div>
    <br />
    <br />
    <br />
    <div class="container">
      <div class="row">
        <div class="col-md-7 col-sm-12">
          <h1>
            Medidor | Analizador de Calidad de Energía | Transmisor de Datos
          </h1>
          <p>
            Cada unidad de nuestro proyecto integra un medidor de variables
            eléctricas, un analizador de calidad de energía y un transmisor de
            datos. Esta poderosa combinación te permite medir, analizar y
            transmitir datos directamente desde el dispositivo hacia una base de
            datos remota. No solo calcula la potencia y el consumo de carga,
            sino también la generación de energía en los paneles solares, el
            consumo de la red eléctrica, y realiza Transformada Rápida de
            Fourier (FFT) para determinar el factor de potencia y los armónicos.
            A diferencia de otros sistemas, nuestro dispositivo no guarda las
            variables localmente, sino que las envía en tiempo real a una base
            de datos accesible en la nube. Esto garantiza que los datos estén
            siempre disponibles y actualizados, pudiendo ser accedidos desde
            cualquier lugar con conexión a internet. La interfaz de usuario
            intuitiva, accesible a través de internet desde una computadora,
            tableta o smartphone, te proporciona visualizaciones en tiempo real
            y te permite interactuar con los datos históricos y en vivo. Una vez
            conectado, tienes acceso a valores en tiempo real, informes a largo
            plazo, una interfaz gráfica interactiva y muchas otras herramientas.
            Lo mejor de todo es que la interfaz de usuario es completamente
            gratuita. Recuperas los datos directamente de tu propia base de
            datos en la nube, asegurando la privacidad y el control total de tus
            datos.
          </p>
          <br />
          <br />
          <h2>Especificaciones Destacadas</h2>

          <ul>
            <li>
              <i class="fas fa-check-circle"></i>
              Medición de Variables Eléctricas para Determinar el Consumo de
              Carga
            </li>
            <li>
              <i class="fas fa-check-circle"></i>
              Generación de Energía en los Paneles Solares
            </li>
            <li>
              <i class="fas fa-check-circle"></i>
              Consumo de la Red Eléctrica
            </li>
            <li>
              <i class="fas fa-check-circle"></i>
              Análisis de FFT para el Factor de Potencia y Armónicos
            </li>
            <li>
              <i class="fas fa-check-circle"></i>
              Transmisión en Tiempo Real a Base de Datos en la Nube
            </li>
            <li>
              <i class="fas fa-check-circle"></i>
              Visualización Web en Tiempo Real Accesible desde Cualquier Lugar
              con Conexión a Internet
            </li>
            <!-- el resto de tus elementos de la lista -->
          </ul>
        </div>

        <div class="col-md-5 col-sm-12 d-flex align-items-center">
          <img
            src="@/assets/Medidor_2.svg"
            alt="Descripción de la imagen"
            class="img-fluid"
          />
        </div>
      </div>
    </div>
     <br>
     <br>
    <div :class="windowWidth > 800 ? 'flex-row' : 'flex-column'">
      <img
        :src="require('@/assets/12.svg')"
        alt="Descripción de la imagen"
        class="responsive-image2 mt-small"
      />
      <img
        :src="require('@/assets/13.svg')"
        alt="Descripción de la imagen"
        class="responsive-image2"
      />
      <img
        :src="require('@/assets/14.svg')"
        alt="Descripción de la imagen"
        class="responsive-image2"
      />
      <img
        :src="require('@/assets/15.svg')"
        alt="Descripción de la imagen"
        class="responsive-image2"
      />
    </div>

    <br />
    <Footer></Footer>
  </div>
</template>




<script>
import Navbar from "@/components/Navbar/NavbarFront.vue";
import Footer from "@/components/Layout/Footer.vue";
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  components: {
    Navbar, // esto registra tu componente Navbar para que puedas usarlo en tu template
  },
  middleware: "notAuthenticated",
  name: "login-page",
  layout: "authhome",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      windowWidth: process.client ? window.innerWidth : 0,
    };
  },

  mounted() {
    if (process.client) {
      window.addEventListener("resize", this.updateWindowWidth);
    }
  },
  beforeDestroy() {
    if (process.client) {
      window.removeEventListener("resize", this.updateWindowWidth);
    }
  },
  methods: {
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
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
      this.user.email = "Demo@example.com"; // replace with demo email
      this.user.password = "121212"; // replace with demo password
      this.login();
    },
  },
};
</script>

<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.block-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}

.responsive-image {
  width: 800px;
  height: 350px;
}
.navbar {
  margin-top: 0 !important;
}

.img-small {
  width: 50%;
  height: auto;
}

.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.responsive-image2 {
  width: 30%;
}

@media screen and (min-width: 800px) {
  .responsive-image2 {
    width: 20%;
  }
}
@media screen and (max-width: 800px) {
  .mt-small {
    margin-top: 180px; /* Ajusta este valor al que necesites */
  }
  .responsive-image2 {
    width: 60%;
  }
}
</style>
