<template>
  <div>
    <b-row>
      <b-col xl="9">
        <b-col xl="2" class="display_inline">
          <span>{{ $t('pageSensors.sensorgraph.interval') }}</span>
        </b-col>
        <b-col xl="2" class="display_inline">
          <b-form-group label-for="hInterval">
            <b-form-select
              id="hInterval"
              v-model="form.historyIntervalValue"
              class="input"
              :options="historyIntervalOptions"
              data-test-id="hInterval-option"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col xl="2" class="display_inline">
          <span>{{ $t('pageSensors.sensorgraph.frame') }}</span>
        </b-col>
        <b-col xl="2" class="display_inline">
          <b-form-group label-for="timeFrame">
            <b-form-select
              id="timeFrame"
              v-model="form.timeFrame"
              class="input"
              :options="timeFrameOptions"
              data-test-id="timeFrame-option"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col xl="2" class="display_inline">
          <div class="text-right mb10">
            <b-button variant="primary" @click="historyIntervalInit()">
              {{ $t('pageSensors.sensorgraph.displayGraph') }}
            </b-button>
          </div>
        </b-col>
      </b-col>
      <b-col xl="2">
        <div class="text-right mb10">
          <b-button variant="primary" @click="initBack()">
            {{ $t('pageSensors.sensorgraph.back') }}
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-if="lineDataDone" xl="12">
        <h2>{{ itemData.Name }}</h2>
        <chart
          v-if="lineDataDone"
          :data="lineData"
          :options="options"
          :type="type"
        />
      </b-col>
    </b-row>
    <b-row v-if="powerConsumptionSensors.includes(itemData.Name)">
      <b-col xl="12">
        <b-table
          responsive="md"
          hover
          :fields="fields"
          :items="averageVal"
          :empty-text="$t('global.table.emptyMessage')"
        >
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import Chart from '@/components/Global/Graph.vue';
import LoadingBarMixin from '@/components/Mixins/LoadingBarMixin';

export default {
  components: {
    Chart,
  },
  mixins: [LoadingBarMixin],
  props: {
    type: {
      type: String,
      default: '',
    },
    sensorGraphData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      lineDataDone: false,
      historyIntervalOptions: [
        {
          text: '10',
          value: 10,
        },
        {
          text: '20',
          value: 20,
        },
        {
          text: '30',
          value: 30,
        },
        {
          text: '60',
          value: 60,
        },
      ],
      timeFrameOptions: [
        {
          text: '10',
          value: 10,
        },
        {
          text: '20',
          value: 20,
        },
        {
          text: '30',
          value: 30,
        },
      ],
      form: {
        historyIntervalValue: '',
        timeFrame: '',
      },
      lineData: {},
      options: {
        defaults: {
          borderColor: '#ce3a2f',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            boxWidth: 25,
            displayColors: false,
            callbacks: {
              title: function (TooltipItem) {
                return TooltipItem[0].label;
              },
              label: function (TooltipItem) {
                return TooltipItem.parsed.y;
              },
            },
            intersect: false,
          },
        },
        responsive: true,
        interaction: {
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Timestamp',
            },
            defaults: {
              borderColor: 'red',
            },
            ticks: {
              autoSkip: false,
            },
          },
          y: {
            display: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Values',
            },
          },
        },
        elements: {
          line: {
            borderColor: '#cf4132',
            borderWidth: 2,
          },
          point: {
            radius: 3,
          },
        },
      },
      itemData: {},
      fields: [
        {
          key: 'average',
          label: this.$t('pageSensors.sensorgraph.average'),
          class: 'text-center',
        },
        {
          key: 'maximum',
          label: this.$t('pageSensors.sensorgraph.max'),
          class: 'text-center',
        },
        {
          key: 'minimum',
          label: this.$t('pageSensors.sensorgraph.min'),
          class: 'text-center',
        },
      ],
      averageVal: [],
      powerConsumptionSensors: [
        'PSU2 Input Power',
        'PSU2 Output Power',
        'Cpu Power Average CPU2',
        'PSU1 Input Power',
        'PSU1 Output Power',
        'Platform Power Average CPU1',
        'Platform Power Average CPU2',
        'Dimm Power Average CPU1',
        'Dimm Power Average CPU2',
        'Cpu Power Average CPU1',
      ],
    };
  },
  watch: {
    lineData() {},
  },
  created() {
    this.itemData = this.sensorGraphData;
    this.historyIntervalInit();
  },
  methods: {
    initBack() {
      this.$emit('backSensorPage');
    },
    async sensorData() {
      this.lineDataDone = false;
      this.lineData = {};
      var datasets = [];
      var labels = [];
      var data = [];
      var label = '';
      var chartdata;
      this.lineData.datasets = [];
      this.lineData.labels = [];
      this.itemData = this.$store.getters['sensors/graphSensors'];
      this.itemData.id = this.itemData['@odata.id'];
      this.itemData.SensorReadings.forEach((val) => {
        label = this.timestammptotime(val.Time);
        data.push(val.Value);
        labels.push(label);
      });
      this.form.historyIntervalValue = this.itemData.Interval;
      this.form.timeFrame = this.itemData.TimeFrame;
      chartdata = {
        data: data,
        fill: true,
        borderColor: '#416f89',
        tension: 0.1,
      };
      datasets.push(chartdata);
      this.lineData = {
        labels: labels,
        datasets: datasets,
      };
      this.averageFindingValues();
    },
    getTimeStamp(timeInSeconds) {
      var evtTimeStamp = '';
      var eventDate = new Date(timeInSeconds * 1000);

      var evtMonth = eventDate.getUTCMonth() + 1;
      evtMonth = (evtMonth < 10 ? '0' : '') + evtMonth;
      var evtDate = eventDate.getUTCDate();
      evtDate = (evtDate < 10 ? '0' : '') + evtDate;
      evtTimeStamp =
        evtMonth + '/' + evtDate + '/' + eventDate.getUTCFullYear();

      var evtHours = eventDate.getUTCHours();
      evtHours = (evtHours < 10 ? '0' : '') + evtHours;
      var evtMins = eventDate.getUTCMinutes();
      evtMins = (evtMins < 10 ? '0' : '') + evtMins;
      var evtSecs = eventDate.getUTCSeconds();
      evtSecs = (evtSecs < 10 ? '0' : '') + evtSecs;
      evtTimeStamp += '  ' + evtHours + ':' + evtMins + ':' + evtSecs;
      return evtTimeStamp;
    },

    timestammptotime(unixTimeStamp) {
      // unixTimeStamp to HH:MM:SS format
      var dateFormat = this.getTimeStamp(unixTimeStamp);
      var HHMMSS = dateFormat.split(' ');
      return HHMMSS[2];
    },
    historyIntervalInit() {
      this.startLoader();
      var historyDataParams = {};
      if (this.form.historyIntervalValue == '') {
        historyDataParams = {
          id: this.itemData.id,
        };
        this.$store
          .dispatch('sensors/getTimeInterval', historyDataParams)
          .finally(() => {
            this.sensorData().then(() => {
              this.lineDataDone = true;
            });
            this.endLoader();
          });
      } else {
        historyDataParams = {
          id: this.itemData.id,
          Interval: this.form.historyIntervalValue,
          TimeFrame: this.form.timeFrame,
        };
        this.$store
          .dispatch('sensors/setTimeInterval', historyDataParams)
          .finally(() => {
            this.$store
              .dispatch('sensors/getTimeInterval', historyDataParams)
              .finally(() => {
                this.sensorData().then(() => {
                  this.lineDataDone = true;
                });
                this.endLoader();
              });
          });
      }
    },
    averageFindingValues() {
      this.averageVal = [];
      const max = Math.max(...this.lineData.datasets[0].data);
      const min = Math.min(...this.lineData.datasets[0].data);
      const aveg =
        this.lineData.datasets[0].data.reduce((acc, c) => acc + c, 0) /
        this.lineData.datasets[0].data.length;
      const averageList = {
        average: aveg.toFixed(2),
        minimum: min.toFixed(2),
        maximum: max.toFixed(2),
      };
      this.averageVal.push(averageList);
    },
  },
};
</script>
<style scoped>
.display_inline {
  display: inline-block;
}
</style>
