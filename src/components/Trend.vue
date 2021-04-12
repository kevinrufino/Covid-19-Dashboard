<template>
  <div class="hello">
    <h2 v-if="countrySelected()">Trends in {{ selectedCountry }}</h2>
    <div id="buttons">
      <button v-if="countrySelected()" v-on:click="yearly()">Yearly Data</button>
      <button v-if="countrySelected()" v-on:click="monthly()">Monthly Data</button>
      <button v-if="countrySelected()" v-on:click="weekly()">Weekly Data</button>
    </div>

    <tbody>
      <tr>
        <th v-if="countrySelected()">Date</th>
        <th v-if="countrySelected()">Critical</th>
        <th v-if="countrySelected()">Deaths</th>
        <th v-if="countrySelected()">Death Ratio</th>
        <th v-if="countrySelected()">Recovered</th>
        <th v-if="countrySelected()">Recovery Ratio</th>
        <th v-if="countrySelected()">Total Cases</th>
      </tr>
      <tr v-for="(zoo,pos) in trendData" :key="pos">
        <td>{{pos}}</td>
        <td>{{zoo.critical}}</td>
        <td>{{zoo.deaths}}</td>
        <td>{{zoo.death_ratio}}</td>
        <td>{{zoo.recovered}}</td>
        <td>{{zoo.recovery_ratio}}</td>
        <td>{{zoo.total_cases}}</td>
      </tr>
    </tbody>

    <ApexChart width="560" :options="o" :series="s" v-if="present()"/>

  </div>
</template>

<script lang="ts">
import {FirebaseFirestore} from "@firebase/firestore-types";
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios from "axios";
import ApexChart from "vue-apexcharts";

@Component({
  components: {
    ApexChart
  },
})
export default class Trend extends Vue {
  @Prop() private selectedCountry!: string;
  readonly $appDB!: FirebaseFirestore;
  private trendData: any = {};
  private x:any = [];
  private y:any = [];
  private z:any = [
    "2021-04-12",
    "2021-03-28",
    "2021-03-14",
    "2021-02-27",
    "2021-02-12",
    "2021-01-29",
    "2021-01-14",
    "2020-12-31",
    "2020-12-16",
    "2020-12-01",
    "2020-11-17",
    "2020-11-02",
    "2020-10-18",
    "2020-10-04",
    "2020-09-19",
    "2020-09-05",
    "2020-08-21",
    "2020-08-06",
    "2020-07-23",
    "2020-07-08",
    "2020-06-24",
    "2020-06-09",
    "2020-05-25",
    "2020-05-11",
    "2020-04-26"
];
  private chart: any = false;

  private o:any = {  
    chart: {
      id: 'covid-dashboard'
    },
    xaxis: {
      categories: this.x
    }
  }

  private s:any = [{
    name: 'covid cases',
    data: this.y
  }]

  present () {
    return this.chart;
  }

  //only true if a country has been selected from App.vue
  countrySelected () {
    // console.log("country selected")
    if (this.selectedCountry) {
      // console.log("this is true", this.selectedCountry);
      return true;
    } else {
      // console.log("this is false", this.selectedCountry);
      return false;
    }
  }

  yearly () {
    axios({
        method: 'GET',
        url: 'https://coronavirus-map.p.rapidapi.com/v1/spots/year',
        params: {region: this.selectedCountry},
        headers: {
          'x-rapidapi-key': '869a3421d6msha8d955e95473116p1be6c3jsn71ec690ffca5',
          'x-rapidapi-host': 'coronavirus-map.p.rapidapi.com'
        }
      })
      .then((r) => {
        let d = new Date();
        let date = d.toISOString();
        this.$appDB
          .collection(`Logs`)
          .add({ time: date, log: "Get Yearly Data"});

        this.trendData = r.data.data;
        console.log("yearly", this.trendData);

        // this.x= [];
        // this.x = Object.keys(this.trendData);
        // for (let k of Object.keys(this.trendData)){
        //  this.o.xaxis.categories.push(k);
        // }
        // console.log("x: ", this.x);
        this.o.xaxis.categories = Object.keys(this.trendData);
        console.log("options", this.o)

        this.s[0].data = []
        // let k: typeof Object.values(r.data.data)
        console.log("THIS HAS TO BE CHANGED", Object.values(this.trendData))
        let k:any;
        for (k of Object.values(this.trendData)){
         this.s[0].data.push(k.total_cases);
        }

        // Object.values(this.trendData).forEach( k => {
        //   this.s[0].data.push(k.total_cases);
        // })
        console.log("series", this.s);

      }).catch(function (error) {
        console.error(error);
      });  
    this.chart = true;
  }

  monthly () {
    axios({
        method: 'GET',
        url: 'https://coronavirus-map.p.rapidapi.com/v1/spots/month',
        params: {region: this.selectedCountry},
        headers: {
          'x-rapidapi-key': '869a3421d6msha8d955e95473116p1be6c3jsn71ec690ffca5',
          'x-rapidapi-host': 'coronavirus-map.p.rapidapi.com'
        }
      })
      .then((r) => {
        let d = new Date();
        let date = d.toISOString();
        this.$appDB
          .collection(`Logs`)
          .add({ time: date, log: "Get Monthly Data"});
                  
        this.trendData = r.data.data;
        console.log("monthly", this.trendData);

        this.o.xaxis.categories = Object.keys(this.trendData);
        console.log("options", this.o)

        this.s[0].data = []
        let k:any;
        for (k of Object.values(this.trendData)){
         this.s[0].data.push(k.total_cases);
        }
        console.log("series", this.s);


      }).catch(function (error) {
        console.error(error);
      });  
    this.chart = true;
  }

  weekly () {
    axios({
        method: 'GET',
        url: 'https://coronavirus-map.p.rapidapi.com/v1/spots/week',
        params: {region: this.selectedCountry},
        headers: {
          'x-rapidapi-key': '869a3421d6msha8d955e95473116p1be6c3jsn71ec690ffca5',
          'x-rapidapi-host': 'coronavirus-map.p.rapidapi.com'
        }
      })
      .then((r) => {
        let d = new Date();
        let date = d.toISOString();
        this.$appDB
          .collection(`Logs`)
          .add({ time: date, log: "Get Weekly Data"});

        this.trendData = r.data.data;
        console.log("weekly: ", this.trendData);

        this.o.xaxis.categories = Object.keys(this.trendData);
        console.log("options", this.o)

        this.s[0].data = []
        let k:any;
        for (k of Object.values(this.trendData)){
         this.s[0].data.push(k.total_cases);
        }
        console.log("series", this.s);

      }).catch(function (error) {
        console.error(error);
      });  

    this.chart = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
button {
  padding: 5px;
}
td {
  padding: 2.5px;
}
th {
  padding: 2.5px;
}
tr:nth-child(even) {
  background: #42b983;
}
tr:nth-child(odd) {
  background: #add8e6;
}
tr:nth-child(1) {
  background: rgb(24, 156, 156);
}
tbody, td, th {
  border: 2px solid black;
}
tbody {
  border-collapse: collapse;
}
</style>
