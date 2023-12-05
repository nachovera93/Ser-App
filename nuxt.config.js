export default {
  ssr: false,
  /*
  ** Headers of the page
  */
  head: {
    title: 'IoT SER',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logoSER.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css' }
    ],
    bodyAttrs: {
      class: '' // Add `white-content` class here to enable "white" mode.
    }
  },
  router: {
    linkExactActiveClass: 'active',
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/',
        redirect: '/home'
      });
    }
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'assets/css/demo.css',
    'assets/css/nucleo-icons.css',
    'assets/sass/black-dashboard.scss',
    'bootstrap/dist/css/bootstrap.css',  // Agrega esta línea
    'bootstrap-vue/dist/bootstrap-vue.css',
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/dashboard-plugin.js',
    { src: '~/plugins/vue-image-upload.js', mode: 'client' },
    '~/plugins/bootstrap-vue.js'  // Asegúrate de crear este archivo en la carpeta de plugins
  ],
  //autoimport
  components: [
    {
      path: '~/components',
      pathPrefix: false,
      extensions: ['vue', 'jsx'],
    }
  ],

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    'nuxt-highcharts',
    'bootstrap-vue/nuxt',

  ],


  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.AXIOS_BASE_URL
  },
  env: {
    mqtt_prefix: process.env.MQTT_PREFIX,
    mqtt_host: process.env.MQTT_HOST,
    mqtt_port: process.env.MQTT_PORT
  },

  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0', // default: localhost
  },

  serverMiddleware: {    //Sirve para levantar la api junto con el el front
    '/api': '~/api'
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    },
    babel: {
      plugins: [
        [
          'component',
          {
            'libraryName': 'element-ui',
            'styleLibraryName': 'theme-chalk'
          }
        ]
      ]
    }
  }
}
