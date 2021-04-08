import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import elementui from "element-ui"
import "element-ui/lib/theme-chalk/index.css";
import global from "../global";
import * as echarts from 'echarts';


Vue.prototype.$echarts = echarts;

Vue.use(elementui)

Vue.config.productionTip = false;


new Vue({
  data(){
    return{
      $$state:{
        global
      }
    }
  }
})

Vue.prototype.$global = global;
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
