<template>
  <div>
    <h5 class="title">Clima Santiago</h5>
    <b-card-group class="weather-card-group">
      <div class="d-flex">
        <div class="mr-2 text-center" style="max-width: 20rem">
          <h6>{{ dayOfWeek }}</h6>
          <p class="smaller-text">{{ currentDate }}</p>
          <b-card no-body :img-src="imageSource" img-alt="Image" img-top>
            <b-card-text class="small-text text-center">
              {{ currentTemperature }}°C
            </b-card-text>
          </b-card>
        </div>
        <div class="mr-2 text-center" style="max-width: 20rem">
          <h6>{{ nextDayOfWeek }}</h6>
          <p class="smaller-text">{{ nextDate }}</p>
          <b-card
            no-body
            :img-src="tomorrowImageSource"
            img-alt="Image"
            img-top
          >
            <b-card-text class="small-text text-center">
              {{ tomorrowTemperature }}°C
            </b-card-text>
          </b-card>
        </div>
        <div class="mr-2 text-center" style="max-width: 20rem">
          <h6>{{ dayAfterNextDayOfWeek }}</h6>
          <p class="smaller-text">{{ dayAfterNextDate }}</p>
          <b-card
            no-body
            :img-src="dayAfterTomorrowImageSource"
            img-alt="Image"
            img-top
          >
            <b-card-text class="small-text text-center">
              {{ dayAfterTomorrowTemperature }}°C
            </b-card-text>
          </b-card>
        </div>
      </div>
    </b-card-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      api_key: "af9c87abc96e962f013d8a6f066a7cad",
      weatherToday: {},
      weatherTomorrow: {},
    };
  },
  computed: {
    currentTemperature() {
      return this.weatherToday.main
        ? (this.weatherToday.main.temp - 273.15).toFixed(2)
        : "";
    },
    tomorrowTemperature() {
      return this.weatherTomorrow.list
        ? (this.weatherTomorrow.list[0].main.temp - 273.15).toFixed(2)
        : "";
    },
    dayAfterTomorrowTemperature() {
      return this.weatherTomorrow.list
        ? (this.weatherTomorrow.list[16].main.temp - 273.15).toFixed(2)
        : "";
    },
    imageSource() {
      console.log("imageSource");
      if (
        this.weatherToday &&
        this.weatherToday.weather &&
        this.weatherToday.weather[0]
      ) {
        console.log("imageSource2");
        if (this.weatherToday.weather[0].main === "Clear") {
          if (this.isNight()) {
            console.log("Noche");
            return "/img/Noche.svg";
          } else {
            console.log("SOLEADO");
            return "/img/Soleado.svg";
          }
        } else if (this.weatherToday.weather[0].main === "Rain") {
          console.log("Hoy Lluvia");
          return "/img/Lluvia.svg";
        } else if (this.weatherToday.weather[0].main === "Clouds") {
          console.log("Hoy nublado");
          return "/img/Nublado1.svg";
        } else if (this.weatherToday.weather[0].main === "Haze") {
          console.log("Hoy bruma");
          return "/img/Nublado1.svg"; // Asegúrate de tener una imagen que represente bruma o cielo parcialmente nublado
        } else if (
          this.weatherToday.weather[0].main === "Mist" ||
          this.weatherToday.weather[0].main === "Fog"
        ) {
          return "/img/Mist.svg"; // Asegúrate de tener una imagen que represente bruma o cielo parcialmente nublado
        }

        console.log(this.weatherToday.weather[0].main);
        console.log("else");
      }
      return "";
    },
    tomorrowImageSource() {
      if (
        this.weatherTomorrow &&
        this.weatherTomorrow.list &&
        this.weatherTomorrow.list[0]
      ) {
        if (this.weatherTomorrow.list[0].weather[0].main === "Clear") {
          console.log(this.weatherTomorrow.list[0].weather[0].main);
          return "/img/Soleado.svg";
        } else if (this.weatherTomorrow.list[0].weather[0].main === "Rain") {
          console.log(this.weatherTomorrow.list[0].weather[0].main);
          return "/img/Lluvia.svg";
        } else if (this.weatherTomorrow.list[0].weather[0].main === "Clouds") {
          console.log(this.weatherTomorrow.list[0].weather[0].main);
          return "/img/Nublado1.svg";
        } else if (
          this.weatherTomorrow.list[16].weather[0].main === "Mist" ||
          this.weatherTomorrow.list[16].weather[0].main === "Fog"
        ) {
          console.log(this.weatherTomorrow.list[0].weather[0].main);
          return "/img/Mist.svg";
        }
      }
      return "";
    },
    dayAfterTomorrowImageSource() {
      if (
        this.weatherTomorrow &&
        this.weatherTomorrow.list &&
        this.weatherTomorrow.list[16]
      ) {
        if (this.weatherTomorrow.list[16].weather[0].main === "Clear") {
          return "/img/Soleado.svg";
        } else if (this.weatherTomorrow.list[16].weather[0].main === "Rain") {
          return "/img/Lluvia.svg";
        } else if (this.weatherTomorrow.list[16].weather[0].main === "Clouds") {
          return "/img/Nublado1.svg";
        } else if (
          this.weatherTomorrow.list[16].weather[0].main === "Mist" ||
          this.weatherTomorrow.list[16].weather[0].main === "Fog"
        ) {
          return "/img/Mist.svg";
        }
      }
      return "";
    },
    dayOfWeek() {
      const weekdays = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
      const today = new Date();
      return weekdays[today.getDay()];
    },
    nextDayOfWeek() {
      const weekdays = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
      const today = new Date();
      return weekdays[(today.getDay() + 1) % 7];
    },
    dayAfterNextDayOfWeek() {
      const weekdays = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
      const today = new Date();
      return weekdays[(today.getDay() + 2) % 7];
    },
    currentDate() {
      const today = new Date();
      return `${today.getDate()}/${today.getMonth() + 1}`;
    },
    nextDate() {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return `${tomorrow.getDate()}/${tomorrow.getMonth() + 1}`;
    },
    dayAfterNextDate() {
      const today = new Date();
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);
      return `${dayAfterTomorrow.getDate()}/${dayAfterTomorrow.getMonth() + 1}`;
    },
  },
  methods: {
    isNight() {
      let currentHour = new Date().getHours();
      return currentHour >= 18 || currentHour < 6;
    },
  },

  mounted() {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=Santiago,cl&APPID=${this.api_key}`
    )
      .then((res) => {
        return res.json();
      })
      .then((results) => {
        this.weatherToday = results;
      });

    fetch(
      `http://api.openweathermap.org/data/2.5/forecast?q=Santiago,cl&APPID=${this.api_key}`
    )
      .then((res) => {
        return res.json();
      })
      .then((results) => {
        this.weatherTomorrow = results;
      });
  },
};
</script>



<style scoped>
.card {
  /* define las dimensiones de la tarjeta */
  width: 100px;
  height: 60px;
}

.small-text {
  font-size: 10px;
  margin-top: 0;
}

.card-title {
  font-size: 12px;
  margin-top: 0;
}

.smaller-text {
  font-size: 10px;
}

.weather-card-group {
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 30px;
}

.title {
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
}
</style>
