<template>
  <!--[if lte IE 9]>
    <p class="browserupgrade">
      You are using an <strong>outdated</strong> browser. Please <a
      href="https://browsehappy.com/">upgrade your browser</a> to improve your
      experience and security.
    </p>
  <![endif]-->
  <div>
    <!-- Preloader -->
    <!-- <div class="preloader"> -->
    <!-- <div class="preloader-inner"> -->
    <!-- <div class="preloader-icon"> -->
    <!-- <span></span> -->
    <!-- <span></span> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- /End Preloader -->

    <!-- Start Header Area -->

    <header class="header navbar-area">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-12">
            <div class="nav-inner">
              <!-- Start Navbar -->
              <nav class="navbar navbar-expand-lg custom-navbar">
                <a class="navbar-brand" href="#">
                  <img src="../assets/images/logo/2.png" alt="Logo" />
                </a>
                <button
                  class="navbar-toggler mobile-menu-btn"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span class="toggler-icon"></span>
                  <span class="toggler-icon"></span>
                  <span class="toggler-icon"></span>
                </button>
                <div
                  class="collapse navbar-collapse sub-menu-bar"
                  id="navbarSupportedContent"
                >
                  <ul id="nav" class="navbar-nav ms-auto">
                    <li class="nav-item">
                      <a href="#" class="active" aria-label="Toggle navigation"
                        >Home</a
                      >
                    </li>
                    <li class="nav-item">
                      <a href="#" aria-label="Toggle navigation">About</a>
                    </li>
                    <li class="nav-item">
                      <a
                        class="dd-menu collapsed"
                        href="javascript:void(0)"
                        data-bs-toggle="collapse"
                        data-bs-target="#submenu-1-1"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        >Pages</a
                      >
                      <ul class="sub-menu collapse" id="submenu-1-1">
                        <li class="nav-item">
                          <a href="#">About Us</a>
                        </li>
                        <li class="nav-item">
                          <a href="#">Sign In</a>
                        </li>
                        <li class="nav-item">
                          <a href="#">Sign Up</a>
                        </li>
                        <li class="nav-item">
                          <a href="#">Reset Password</a>
                        </li>
                        <li class="nav-item">
                          <a href="m#">Mail Success</a>
                        </li>
                        <li class="nav-item">
                          <a href="#">404 Error</a>
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item">
                      <a
                        class="dd-menu collapsed"
                        href="javascript:void(0)"
                        data-bs-toggle="collapse"
                        data-bs-target="#submenu-1-2"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        >Blog</a
                      >
                      <ul class="sub-menu collapse" id="submenu-1-2">
                        <li class="nav-item">
                          <a href="#">Blog Grid</a>
                        </li>
                        <li class="nav-item">
                          <a href="#">Blog Single</a>
                        </li>
                      </ul>
                    </li>
                    <li class="nav-item">
                      <a href="#" aria-label="Toggle navigation">Contact</a>
                    </li>
                  </ul>
                </div>
                <!-- navbar collapse -->
                <div>
                  <b-button pill variant="success" to="/login"
                    >Get Started</b-button
                  >
                </div>
              </nav>
              <!-- End Navbar -->
            </div>
          </div>
        </div>
        <!-- row -->
      </div>
      <!-- container -->
    </header>

    <!-- End Header Area -->

    <!-- Start Hero Area -->
    <section class="hero-area">
      <img
        class="hero-shape"
        src="../assets/images/hero/hero-shape.svg"
        alt="#"
      />
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5 col-md-12 col-12">
            <div class="hero-content">
              <h4 class="wow fadeInUp" data-wow-delay=".2s">
                Descubre el Poder de la Automatización Inteligente
              </h4>
              <h1 class="wow fadeInUp" data-wow-delay=".4s">
                Datos que trabajan <br />
                <span>
                  <img
                    class="text-shape"
                    src="../assets/images/hero/text-shape.svg"
                    alt="#"
                  />
                  para ti.
                </span>
              </h1>
              <p class="wow fadeInUp" data-wow-delay=".6s">
                Maximiza la eficiencia con análisis en tiempo real y toma de
                decisiones ágiles
              </p>
              <div class="button wow fadeInUp" data-wow-delay=".8s">
                <a href="about-us.html" class="btn">Descubre más</a>
              </div>
            </div>
          </div>
          <div class="col-lg-7 col-12">
            <div class="hero-image">
              <img
                class="main-image"
                src="../assets/images/hero/6.png"
                alt="#"
              />
              <img
                class="h2-move-1"
                src="../assets/images/hero/MQTT.png"
                alt="#"
                width="50%"
                height="auto"
                style="margin-left: 110px"
              />
              <img
                class="h2-move-2"
                src="../assets/images/hero/MQTT-2.png"
                alt="#"
                width="30%"
                height="auto"
                style="margin-top: 50px"
              />
              <img
                class="h2-move-3"
                src="../assets/images/hero/MQTT-3.png"
                alt="#"
                width="20%"
                height="auto"
                style="margin-right: 100px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- End Hero Area -->

    <!-- Start Feature Area -->
    <div class="feature section">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="section-title">
              <h3 class="wow zoomIn" data-wow-delay=".2s">Porque Nosotros</h3>
              <h2 class="wow fadeInUp" data-wow-delay=".4s">
                Nuentras caracteristicas
              </h2>
              <p
                class="wow fadeInUp"
                data-wow-delay=".6s"
                style="color: #424242; font-weight: bold"
              >
                Opta por una solución de monitoreo avanzada que integra sin
                esfuerzo los dispositivos IoT en tu infraestructura existente.
                Nuestra plataforma flexible y adaptable es perfecta para el
                sector energético y más allá, con una interfaz de usuario
                intuitiva y almacenamiento de datos escalable para una visión y
                control completos de tus operaciones
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <div
            class="col-lg-4 col-md-6 col-12 wow fadeInUp"
            data-wow-delay=".2s"
          >
            <div class="feature-box">
              <div class="tumb">
                <img
                  src="../assets/images/features/feature-icon-1.png"
                  alt=""
                />
              </div>
              <h4 class="text-title">Conectividad Total</h4>
              <p style="color: #424242; font-weight: bold">
                Implementa IoT para recopilación de datos precisa. Experimenta
                la integración perfecta y la recopilación de datos en tiempo
                real.
              </p>
            </div>
          </div>
          <div
            class="col-lg-4 col-md-6 col-12 wow fadeInUp"
            data-wow-delay=".4s"
          >
            <div class="feature-box">
              <div class="tumb">
                <img
                  src="../assets/images/features/feature-icon-2.png"
                  alt=""
                />
              </div>
              <h4 class="text-title">Seguridad Avanzada</h4>
              <p style="color: #424242; font-weight: bold">
                Garantiza la integridad de tus datos y procesamiento en la nube.
                Confía en la seguridad y escalabilidad que tu infraestructura
                demanda.
              </p>
            </div>
          </div>
          <div
            class="col-lg-4 col-md-6 col-12 wow fadeInUp"
            data-wow-delay=".6s"
          >
            <div class="feature-box">
              <div class="tumb">
                <img
                  src="../assets/images/features/feature-icon-3.png"
                  alt=""
                />
              </div>
              <h4 class="text-title">Análisis Inteligente</h4>
              <p style="color: #424242; font-weight: bold">
                Transforma datos en decisiones. Accede a análisis poderosos y
                almacenamiento persistente para una gestión de datos superior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- End Features Area -->

    <!-- Start Call Action Area -->
    <!-- <section class="call-action"> -->
    <!-- <div class="container"> -->
    <!-- <div class="inner-content"> -->
    <!-- <div class="row align-items-center"> -->
    <!-- <div class="col-lg-6 col-md-7 col-12"> -->
    <!-- <div class="text"> -->
    <!-- <h2> -->
    <!-- You are using free <br /> -->
    <!-- <span>Lite version of CryptoLand.</span> -->
    <!-- </h2> -->
    <!-- <p style="display: block; margin-top: 10px"> -->
    <!-- Please, purchase full version of the template to get all -->
    <!-- pages, features and commercial license. -->
    <!-- </p> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- <div class="col-lg-6 col-md-5 col-12"> -->
    <!-- <div class="button"> -->
    <!-- <a href="#" class="btn">Buy Pro Version </a> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- </div> -->
    <!-- </section> -->
    <!-- End Call Action Area -->

    <!-- Start Footer Area -->
    <footer class="footer section">
      <div class="footer-top">
        <div class="container">
          <div class="inner-content">
            <div class="row">
              <div class="col-lg-4 col-md-6 col-12">
                <div class="single-footer f-about">
                  <div class="logo">
                    <a href="index.html">
                      <img
                        src="../assets/images/logo/2.png"
                        alt="IoT Vision Logo"
                        width="50%"
                        height="auto"
                      />
                    </a>
                  </div>
                  <p>
                    Innovación en tiempo real a tu alcance. Transforma datos en
                    acción de manera eficiente y segura.
                  </p>
                  <!-- <h4 class="social-title">Síguenos en:</h4> -->
                  <!-- <ul class="social"> -->
                  <!-- Actualiza los enlaces de las redes sociales aquí -->
                  <!-- <li> -->
                  <!-- <a href="#"><i class="lni lni-facebook-filled"></i></a> -->
                  <!-- </li> -->
                  <!-- <li> -->
                  <!-- <a href="#"><i class="lni lni-instagram"></i></a> -->
                  <!-- </li> -->
                  <!-- <li> -->
                  <!-- <a href="#"><i class="lni lni-twitter-original"></i></a> -->
                  <!-- </li> -->
                  <!-- <li> -->
                  <!-- <a href="#"><i class="lni lni-linkedin-original"></i></a> -->
                  <!-- </li> -->
                  <!-- Considera remover los iconos de redes sociales no utilizados -->
                  <!-- </ul> -->
                </div>
              </div>
              <div class="col-lg-2 col-md-6 col-12">
                <div class="single-footer f-link">
                  <h3>Soluciones</h3>
                  <ul>
                    <li><a href="#">Monitoreo Energético</a></li>
                    <li><a href="#">Gestión de Dispositivos</a></li>
                    <li><a href="#">Análisis Predictivo</a></li>
                    <li><a href="#">Automatización Inteligente</a></li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-2 col-md-6 col-12">
                <div class="single-footer f-link">
                  <h3>Soporte</h3>
                  <ul>
                    <li><a href="#">Precios</a></li>
                    <li><a href="#">Documentación</a></li>
                    <li><a href="#">Guías de Usuario</a></li>
                    <li><a href="#">Soporte</a></li>
                    <!-- <li><a href="#">Estado del API</a></li> -->
                  </ul>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-12">
                <div class="single-footer newsletter">
                  <h3>Suscríbete</h3>
                  <p>
                    Suscríbete a nuestro boletín para obtener las últimas
                    actualizaciones en soluciones IoT e IA.
                  </p>
                  <form
                    action="#"
                    method="get"
                    target="_blank"
                    class="newsletter-form"
                  >
                    <input
                      name="EMAIL"
                      placeholder="Dirección de correo"
                      required="required"
                      type="email"
                    />
                    <div class="button">
                      <button class="sub-btn">
                        <i class="lni lni-envelope"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="copyright-area">
        <div class="container">
          <div class="inner-content">
            <div class="row">
              <div class="col-lg-6 col-md-6 col-12">
                <p class="copyright-text">
                  © 2023 IoTSER - Todos los Derechos Reservados
                </p>
              </div>
              <div class="col-lg-6 col-md-6 col-12">
                <!-- Asegúrate de reemplazar con tu información o la de tu empresa -->
                <p class="copyright-owner">
                  Diseñado y Desarrollado por
                  <a
                    href="https://app.iotser.com/"
                    rel="nofollow"
                    target="_blank"
                    >IoTSER</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <!--/ End Footer Area -->

    <!-- ========================= scroll-top ========================= -->
    <a href="#" class="scroll-top">
      <i class="lni lni-chevron-up"></i>
    </a>

    <!-- ========================= JS here ========================= -->
  </div>
</template>

<script>
//import { swiper, swiperSlide } from "vue-awesome-swiper";
import Navbar from "@/components/Navbar/NavbarFront.vue";
//import "swiper/css/swiper.css";
const Cookie = process.client ? require("js-cookie") : undefined;

export default {
  components: {
    //swiper,
    //swiperSlide,
    Navbar,
  },
  middleware: "notAuthenticated",
  name: "login-page",
  layout: "authhome",
  data() {
    return {
      isSmallScreen: false,
      user: {
        email: "",
        password: "",
      },
      windowWidth: process.client ? window.innerWidth : 0,
    };
  },
  mounted() {
    this.adjustNavbar();
    window.addEventListener("resize", this.adjustNavbar);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.adjustNavbar);
  },

  methods: {
    adjustNavbar() {
      this.isSmallScreen = window.innerWidth < 992;
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

<style>
/* Asegúrate de que las rutas de importación sean correctas */
/* Por ejemplo, si los estilos y fuentes están en la carpeta assets/css y assets/fonts respectivamente */
@import "../static/css2/bootstrap.min.css";
@import "../static/css2/LineIcons.css";
@import "../static/css2/animate.css";
@import "../static/css2/tiny-slider.css";
@import "../static/css2/glightbox.min.css";
@import "../static/css2/main.css";
.custom-navbar {
  background: transparent;
  box-shadow: none;
}

.custom-navbar.collapsed {
  background: rgba(255, 255, 255, 0.8); /* Fondo blanco con transparencia */
}
/* Opcional: Estilo para el menú desplegable en móviles */
.navbar-toggler {
  border-color: transparent;
}
</style>

