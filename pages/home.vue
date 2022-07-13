<template >
  <!--style="margin-top:0px"-->
   <b-container class="mt-1  ">
      <b-navbar  toggleable="lg" type="dark" variant="white">
        <b-navbar-brand href="#">IOTSER</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown text="Lang" right>
              <b-dropdown-item href="#">EN</b-dropdown-item>
              <b-dropdown-item href="#">ES</b-dropdown-item>
              <b-dropdown-item href="#">RU</b-dropdown-item>
              <b-dropdown-item href="#">FA</b-dropdown-item>
            </b-nav-item-dropdown>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em href="/login">Login Clientes</em>
              </template>
              <b-dropdown-item href="/login">Login Clientes</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    
  <div class="mt-3">

      <b-card bg-variant="warning" text-variant="white" header="Warning" class="text-center" >
        <b-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</b-card-text>
      </b-card>

  </div>
    <div>
      <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="4000"
        controls
        indicators
        background="#ababab"
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <!-- Text slides with image -->
        <b-carousel-slide
          caption="First slide"
          text="Nulla vitae elit libero, a pharetra augue mollis interdum."
          img-src="https://picsum.photos/1024/480/?image=52"
        ></b-carousel-slide>

        <!-- Slides with custom text -->
        <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
          <h1>Hello world!</h1>
        </b-carousel-slide>

        <!-- Slides with image only -->
        <b-carousel-slide
          img-src="https://picsum.photos/1024/480/?image=58"
        ></b-carousel-slide>

        <!-- Slides with img slot -->
        <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
        <b-carousel-slide>
          <template #img>
            <img
              class="d-block img-fluid w-100"
              width="1024"
              height="480"
              src="https://picsum.photos/1024/480/?image=55"
              alt="image slot"
            />
          </template>
        </b-carousel-slide>

        <!-- Slide with blank fluid image to maintain slide aspect ratio -->
        <b-carousel-slide caption="Blank Image" img-blank img-alt="Blank image">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            eros felis, tincidunt a tincidunt eget, convallis vel est. Ut
            pellentesque ut lacus vel interdum.
          </p>
        </b-carousel-slide>
      </b-carousel>


    </div>

<div>
  <b-card bg-variant="primary"   no-body class="overflow-hidden" style="max-width: 540px;">
    <b-row no-gutters>
      <b-col md="6">
        <b-card-img src="https://picsum.photos/400/400/?image=20" alt="Image" class="rounded-0"></b-card-img>
      </b-col>
      <b-col md="6">
        <b-card-body  title="Horizontal Card">
          <b-card-text >
            This is a wider card with supporting text as a natural lead-in to additional content.
            This content is a little bit longer.
          </b-card-text>
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</div>

    <!--<div class="row"></div>
     <base-nav class="navbar-absolute top-navbar " type="success"> 
      <span class="navbar-text h2 mb-0">
        IOTSER
      </span>

      <ul class="navbar-nav ml-auto">
        <li class="nav-item active ">
          <a class="nav-link" href="#"
            >Home <span class="sr-only">(current)</span></a
          >
        </li>
        <li class="nav-item ml-auto ">
          <a class="nav-link" href="#">Proyectos</a>
        </li>
        <li class="nav-item ml-auto">
          <a class="nav-link" href="#">Login Clientes</a>
        </li>
      </ul>
    </base-nav> -->

  
    <div class="row">
      <card class="col-lg-3 " style="width: 20rem;">
        <blockquote class="blockquote mb-0">
          <p>
            Espectacular servicio, todo de primera calidad. Eh logrado ahorrar
            en gran cantidad
          </p>
          <footer class="blockquote-footer">
            Gringo <cite title="Source Title"></cite>
            <img
              class="mb-3 pull-right"
              width="50"
              src="https://929687.smushcdn.com/2633864/wp-content/uploads/2019/11/paul_lee_interview_family.jpg?lossy=1&strip=1&webp=1"
              alt="Card image"
            />
          </footer>
        </blockquote>
      </card>
    </div>
    <div class="row">
      <card>
        <div class="text-center" slot="header">
          <h2>Servicios de energias renovables</h2>
        </div>
        <div class="row">
          <div class="col-lg-3" style="width: 20rem;">
            <card
              type="pricing"
              class="card-success card-white text-center"
              footer-classes="text-center "
            >
              <h3 class="card-title">IOTSER Intelligent Box</h3>
              <img class="card-img" src="img//medidor.jpeg" alt="Image" />
              <base-button
                slot="footer"
                round
                type="success"
                class="btn-just-icon"
              >
                Cotizar
              </base-button>
            </card>
          </div>
          <div class="col-lg-3" style="width: 20rem;">
            <card
              type="pricing"
              class="card-success card-white text-center"
              footer-classes="text-center"
            >
              <h3 class="card-title">Sistema Fotovoltaico On Grid</h3>
              <img class="card-img" src="img//OnGrid.jpeg" alt="Image" />

              <base-button
                slot="footer"
                round
                type="success"
                class="btn-just-icon"
              >
                Cotizar
              </base-button>
            </card>
          </div>
        </div>
      </card>
    </div>
    <div class="row">
      <Iotswitch :config="configIndicator"></Iotswitch>
    </div>
    <!-- <div class="row"> -->
      <!-- <Simple :config="configIndicator2"></Simple> -->
    <!-- </div> -->
    <div class="row">
      <Iotindicator :config="configIndicator3"></Iotindicator>
    </div>
    <div class="row">
      <CostComponent :config="configIndicator2"></CostComponent>
    </div>
    <div class="row pull-right mb-3">
      <Simple2 :config="configIndicator4"></Simple2>
    </div>
     
  </b-container>
   
  
</template>

<script>
import { BaseNav } from "@/components";
import Indicator from "../components/Widgets/Indicator.vue";
import mqtt from "mqtt";
//const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware: "notAuthenticated",
  layout: "authhome",
  components: {
    BaseNav,
    Indicator
  },
  data() {
    return {
      
      slide: 0,
      sliding: null,
      user: "Nacho",
      value: false,
      topic: "",
      options: {
        host: process.env.mqtt_host, //Red local o vps
        port: process.env.mqtt_port, //puertos de mqtt
        endpoint: "/mqtt",
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 5000,
        // Certification Information
        clientId:
          "web_" + "hola" + "_" + Math.floor(Math.random() * 1000000 + 1),
        username: "superuser",
        password: "superuser"
      },
      configIndicator: {
        userId: "Nacho",
        selectedDevice: {
          name: "Homes",
          dId: "8888",
          templateName: "Power Sensor",
          templateId: "984237562348756ldksjfh",
          saverRule: false
        },
        variableFullName: "Pump1",
        variable: "var11",
        icon: "fa-sun",
        column: "col-3",
        widget: "indicator",
        class: "success",
        text: "Bomba",
        message: "{'fanstatus': 'stop'}"
      },
      configIndicator2: {
        userId: "Nacho",
        selectedDevice: {
          name: "Total",
          dId: "9999",
          templateName: "Power Sensor",
          templateId: "984237562348756",
          saverRule: false
        },
        variableFullName: "Pump1",
        variable: "var22",
        colorLetra:"dark",
        unit: "$",
        icon: "fa-sun",
        column: "col-6",
        class: "info"
      },
      configIndicator3: {
        userId: "Nacho",
        selectedDevice: {
          name: "Indicator",
          dId: "7777",
          templateName: "Power Sensor",
          templateId: "98423758756",
          saverRule: false
        },
        variableFullName: "Pump1",
        variable: "var33",
        icon: "fa-sun",
        column: "col-6",
        class: "success"
      },
      configIndicator4: {
        userId: "Nacho",
        selectedDevice: {
          name: "Indicator",
          dId: "5555",
          templateName: "Power Sensor",
          templateId: "98423758756",
          saverRule: false
        },
        variableFullName: "Pump1",
        variable: "var55",
        variable2: "var554",
        icon: "fa-sun",
        column: "col-6",
        class: "success"
      }
    };
  },

  mounted() {
    console.log("Comenzando conexión");
    this.startMqttClient();
  },
  methods: {
    startMqttClient() {
      //ejemplo topic: "userid/did/variableId/sdata"
      const deviceSubscribeTopic = this.user + "/+/+/sdata";
      const notifSubscribeTopic = this.user + "/+/+/notif";
      const connectUrl =
        "ws://" +
        this.options.host +
        ":" +
        this.options.port +
        this.options.endpoint;
      try {
        this.client = mqtt.connect(connectUrl, this.options);
      } catch (error) {
        console.log(error);
      }
      //MQTT CONNECTION SUCCESS
      this.client.on("connect", () => {
        console.log("Connection succeeded!");
        //SDATA SUBSCRIBE
        this.client.subscribe(deviceSubscribeTopic, { qos: 0 }, err => {
          if (err) {
            console.log("Error in DeviceSubscription");
            return;
          }
          console.log("Device subscription Success");
          console.log(deviceSubscribeTopic);
        });
        //NOTIF SUBSCRIBE
        this.client.subscribe(notifSubscribeTopic, { qos: 0 }, err => {
          if (err) {
            console.log("Error in NotifSubscription");
            return;
          }
          console.log("Notif subscription Success");
          console.log(notifSubscribeTopic);
        });
      });
      this.client.on("error", error => {
        console.log("Connection failed", error);
      });
      this.client.on("reconnect", error => {
        console.log("reconnecting:", error);
      });
      this.client.on("message", (topic, message) => {
        console.log("Message from topic " + topic + " -> ");
        console.log(message.toString());
        try {
          const splittedTopic = topic.split("/");
          const msgType = splittedTopic[3];
          if (msgType == "notif") {
            this.$notify({
              type: "danger",
              icon: "tim-icons icon-alert-circle-exc",
              message: message.toString()
            });
            this.$store.dispatch("getNotifications");
            return;
          } else if (msgType == "sdata") {
            $nuxt.$emit(topic, JSON.parse(message.toString()));
            console.log("emitimos:", topic);
            return;
          }
        } catch (error) {
          console.log(error);
        }
      });

      $nuxt.$on("mqtt-sender", toSend => {
        this.client.publish(toSend.topic, JSON.stringify(toSend.msg)); //mqtt solo acepta json por lo que se usa el json stringify
      });
    },
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
  }
};
</script>

<style lang="scss"></style>
