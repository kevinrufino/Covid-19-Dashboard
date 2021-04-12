import Vue from 'vue'
import App from './App.vue'
import VueApexCharts from "vue-apexcharts";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

Vue.use(VueApexCharts);
Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyCDRixlenq-JmQWv83j-loSsElKTyXupGE",
  authDomain: "covid-dashboard-cf6eb.firebaseapp.com",
  projectId: "covid-dashboard-cf6eb",
  storageBucket: "covid-dashboard-cf6eb.appspot.com",
  messagingSenderId: "350839172404",
  appId: "1:350839172404:web:8da8279291370574f54961",
  measurementId: "G-3TW0XXNQ0X"
};

firebase.initializeApp(firebaseConfig);
Vue.prototype.$appAuth = firebase.auth();
Vue.prototype.$appDB = firebase.firestore();

new Vue({
  render: h => h(App),
}).$mount('#app')
