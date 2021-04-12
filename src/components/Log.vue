<template>
  <div class="hello">
    <h2>Logs:</h2>
    <ul v-for="(zoo,pos) in logs" :key="pos">
      <li>{{ zoo.time }} | {{ zoo.log }}</li>
    </ul>
    
  </div>
</template>

<script lang="ts">
import {FirebaseFirestore} from "@firebase/firestore-types";
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Log extends Vue {
  readonly $appDB!: FirebaseFirestore;
  private logs:any = [];

  mounted () {
    this.$appDB
      .collection(`Logs`)
      .orderBy("time")       // Sort by category name
      .onSnapshot((qs) => {
        this.logs.splice(0);  // remove old data
        qs.forEach((qds) => {
          if (qds.exists) {
            const catData = qds.data();
            this.logs.push({
              time: catData.time,
              log: catData.log,
            });
          }
        });
      });
    console.log("logs: ", this.logs);
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
</style>
