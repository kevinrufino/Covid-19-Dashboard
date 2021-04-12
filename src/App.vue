<template>
  <div id="app">
    <h1>Covid-19 Dashboard by Kevin Rufino</h1>
    <p>
      I confirm that the work submitted for grading is solely mine. While working on this take
      home exam, I neither received nor gave any assistance from/to other human beings. I
      understand that violating this academic honesty may seriously impact my grade for this class.
    </p>
    <div id="select">
      <p>
      Select Country
      <select v-model="selectedCountry" v-on:click="clicked()"> 
        <option v-for="(c, pos) in countryData" :value="c.name" :key="pos">{{c.name}}</option> 
      </select>
      </p>
    </div>
    <div id='comp'>
      <WorldStats class="box"/>
      <Trend :selectedCountry="selectedCountry" class="box"/>
      <Log class="box"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Trend from './components/Trend.vue';
import WorldStats from './components/WorldStats.vue';
import Log from './components/Log.vue';
import axios from "axios";

@Component({
  components: {
    WorldStats,
    Trend,
    Log,
  },
})
export default class App extends Vue {
    private countryData = {};
    // private selectedCountry = "";
    private selectedCountry = "";

    // clicked(): any {
    //   //when buttonclicked, send .name to trend as prop
    //   console.log("v-model",this.selectedCountry1);
    //   console.log("v-bind",this.selectedCountry);
    //   return this.selectedCountry;
    // }

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
        console.log(r.data);
        this.countryData = r.data.data.regions;
      }).catch(function (error) {
        console.error(error);
      });      
    }

  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
#comp {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.box{
  flex: 1 1 150px; /*  Stretching: */
  flex: 0 1 150px; /*  No stretching: */
  margin: 5px;
}
#select{
  display: grid;
  place-items:center;
}
</style>
