<template>
  <div class="hello">
    <h2>World Statistics</h2>
    
    <div id="buttons">
        <button v-on:click="countrySort">Country Sort</button>
        <button v-on:click="totalCasesSort">Total Cases Sort</button>
        <button v-on:click="recoverySort">Recovery Sort</button>
    </div>
    
    <tbody>
        <tr>
            <th>Country</th>
            <th>Total Cases</th>
            <th>Recovery Rate</th>
            <th>Death Rate</th>
        </tr>
        <tr v-for="(zoo,pos) in sortedData" :key="pos" :class="chooseColor(sortedData[pos][1].recovery_ratio)">
            <td id="left">{{zoo[1].name}}</td>
            <td id="right">{{zoo[1].total_cases}}</td>
            <td id="center">{{(zoo[1].recovery_ratio*100).toFixed(2) + "%"}}</td>
            <td id="center">{{(zoo[1].death_ratio*100).toFixed(2) + "%"}}</td>
        </tr>
    </tbody>

  </div>
</template>

<script lang="ts">
import {FirebaseFirestore} from "@firebase/firestore-types";
import { Component, Vue } from 'vue-property-decorator';
import axios from "axios";

@Component
export default class WorldStats extends Vue {
    readonly $appDB!: FirebaseFirestore;
    private countryData = {};
    private sortedData = [];
    private class = "";

    mounted(): void {
      // var countries;
      axios({
        method: 'GET',
        url: 'https://coronavirus-map.p.rapidapi.com/v1/summary/latest',
        headers: {
          'x-rapidapi-key': '869a3421d6msha8d955e95473116p1be6c3jsn71ec690ffca5',
          'x-rapidapi-host': 'coronavirus-map.p.rapidapi.com'
        }
      })
      .then((r) => {
        console.log("country data", r.data.data.regions);
        this.countryData = r.data.data.regions;
        this.sortedData = Object.entries(this.countryData)
        console.log("sorted data", this.sortedData)
      }).catch(function (error) {
        console.error(error);
      });      
    }

    countrySort (): any {
      let d = new Date();
      let date = d.toISOString();
      this.sortedData.sort();
      console.log("country sort:", this.sortedData);
      this.$appDB
        .collection(`Logs`)
        .add({ time: date, log: "Sort by country"});
    }

    totalCasesSort (): void {
      let d = new Date();
      let date = d.toISOString();
      this.sortedData.sort((a, b)  => {
        if(a[1].total_cases < b[1].total_cases) {
          return 1;
        } else {
          return -1
        }
      });
      console.log("total cases sort:", this.sortedData);
      this.$appDB
        .collection(`Logs`)
        .add({ time: date, log: "Sort by # of total cases"});
    }

    recoverySort (): void {
      let d = new Date();
      let date = d.toISOString();
      this.sortedData.sort((a, b)  => {
        if(a[1].recovery_ratio > b[1].recovery_ratio) {
          return 1;
        } else {
          return -1
        }
      });
      console.log("recovery sort:", this.sortedData);
      this.$appDB
        .collection(`Logs`)
        .add({ time: date, log: "Sort by recovery %"});
    }

    chooseColor (color: any): any {
      // console.log("recovery value: ", color)
      if (color < .5) {
        this.class="red"
        return this.class
      } 
      else if (color > .85){
        this.class="green"
        return this.class
      } 
      else {
        this.class="yellow"
        return this.class
      }
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
#left{
  text-align: left;
}
#right{
  text-align: right;
}
#center{
  text-align: center;
}
.red{
  background: red;
  color: white;
}
.yellow{
  background: yellow;
}
.green{
  background: green;
}
tbody, td, th {
  border: 2px solid grey;
}
tbody {
  border-collapse: collapse;
}
</style>
