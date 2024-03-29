<template>
  <div class="chartElem">
    <div class="row">
      <div class="col-3-auto col-md-3">
        <div id="chartType">
          <label>Chart Type</label>
          <b-form-select
            v-model="chartType"
            :options="chartTypes"
          />
        </div>
       
        <div id="animationDuration">
          <label>Animation Duration</label>
          <b-form-select v-model.number="animationDuration" :options="durations" />
        </div> 
        <div id="yAxis">
          <label>y-axis Title</label>
          <input
            v-model="yAxis"
            class="form-control centered"
            @focus="watchers = ['options.yAxis']"
            @blur="watchers = undefined"
          >
        </div>
        <div id="seriesName">
          <label>Series Name</label>
          <input
            v-model="seriesName"
            class="form-control centered"
            @focus="watchers = ['options.series']"
            @blur="watchers = undefined"
          >
        </div>
        <div id="seriesColor">
          <label>Series Color</label>
          <div>
            <input
              v-if="colorInputIsSupported"
              id="colorPicker"
              v-model="seriesColor"
              type="color"
            >
            <b-form-select v-else v-model="seriesColor" :options="colors" />
          </div>
          <p>Current color: {{ seriesColor }}</p>
        </div>
        <div id="sexy-bkg">
          <b-form-checkbox v-model="sexy">
            Make it sexy
          </b-form-checkbox>  
        </div>      
        <div id="last-point-info">
          <label>Click a point to trigger event</label>
          <div>
            <div>x: {{ lastPointClicked.x }}</div>
            <div>y: {{ lastPointClicked.y }}</div>
          </div>
        </div>
        <div id="caption">
          <label>Set chart caption</label>
          <input v-model="caption" 
            class="form-control centered"
            @focus="watchers = ['options.caption']"
            @blur="watchers = undefined"
          />
        </div>  
      </div> 
      <div class="col-9-auto col-md-9">
        
         <input
          v-model="subtitle"
          class="form-control centered"
          @focus="watchers = ['options.subtitle']"
          @blur="watchers = undefined"
        >
        
        <highchart
          :options="chartOptions"
          :animation="{duration: animationDuration}"
          :exporting="true"
          :update="watchers"
          @chartLoaded="chartLoaded"
        />
        <div>
          
          <b-input-group class="mt-3">
            <b-form-input
              v-for="index in points.length"
              :key="index"
              v-model.number="points[index-1]"
              class="centered"
              type="number"
              @focus="watchers = ['options.series']"
              @blur="watchers = undefined"
            /> 
          </b-input-group> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: ["config"],
  data() {
    return {
      caption: 'Chart caption here',
      title: 'Basic Chart',
      subtitle: 'More details here',
      points: [10, 0, 8, 2, 6, 4, 5, 5],
      seriesColor: '',
      animationDuration: 1000,
      chartType: '',
      colorInputIsSupported: null,
      chartTypes: [],
      durations: [0, 500, 1000, 2000],
      seriesName: 'My Data',
      yAxis: 'My Values',
      watchers: undefined,
      colors: [
        'Red',
        'Green',
        'Blue',
        'Pink',
        'Orange',
        'Brown',
        'Black',
        'Purple'
      ],
      lastPointClicked: {
        timestamp: '',
        x: '',
        y: ''
      },
      sexy: false
    }
  },
  computed: {
    invertedColor() {
      return (offset = 0) => '#' 
      + ((parseInt(`0x${this.seriesColor.split('#')[1]}`) ^ 0xffffff) + offset)
        .toString(16)
    },
    chartOptions() {
      console.log(this.chartType.toLowerCase())
      const ctx = this
      return {
        caption: {
          text: this.caption,
          style: {
            color: this.sexy ? this.invertedColor(0) : '#black'
          },
        },
        chart: {
          backgroundColor: this.sexy ? {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
                [0, this.seriesColor],
                [0.5, '#ffffff'],
                [1, this.seriesColor]
            ]
          } : '#ffffff',
          className: 'my-chart',
          type: this.chartType.toLowerCase()
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click() {
                  ctx.$emit('pointClicked', this)
                }
              }
            }
          }
        },
        yAxis: [{
          title: {
            text: this.yAxis,
            style: {
              color: '#000000'
            }
          }
        }],
        title: {
          style: {
            color: this.sexy ? this.invertedColor(0) : '#black'
          },
          text: `${this.title} ` +
            (this.lastPointClicked.timestamp !== ''
              ? `(Point clicked: ${this.lastPointClicked.timestamp})`
              : '')
        },
        subtitle: {
	        style: {
            color: this.sexy ? this.invertedColor(0) : '#black'
          },
          text: `${this.subtitle}`
        },
        legend: {
          itemStyle: {
            color: this.sexy ? this.invertedColor(0) : '#black'
          }
        },
        series: [{
          name: this.seriesName,
          data: this.points,
          color: this.seriesColor
        }]
      }
    }
  },
  mounted() {
    const i = document.createElement('input')
    i.setAttribute('type', 'color')
    this.colorInputIsSupported = (i.type === 'color')
    this.chartTypes = this.$highcharts.chartTypes
    console.log("charttypes " ,this.$highcharts.chartTypes)
    this.chartType = this.chartTypes[0]
    this.seriesColor = this.colorInputIsSupported ? '#6020cd' : this.colors[0]
    this.$on('pointClicked', (evt) => {
      this.$nextTick(() => {
        this.doubleIt(evt.x, evt.y)
      })
    })
  },
  methods: {
    chartLoaded(chart) {
      // eslint-disable-next-line no-console
      console.log('Chart Loaded! ')
      console.log('If you need to interact with the API directly, here you go!', chart)
      console.log('Helpul tip: away from the docs? chart.__proto__ in dev tools will show you the methods:', chart.__proto__)  
    },
    doubleIt(x, y) {
      Object.assign(this.lastPointClicked, { x, y })
      this.lastPointClicked.timestamp = (new Date()).toUTCString()
      this.points[x] *= 2
    },
    
  }
}
</script>

<style scoped>
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
 #colorPicker {
  border: 0;
  padding: 0;
  margin: 0;
  width: 30px;
  height: 30px;
}
</style>