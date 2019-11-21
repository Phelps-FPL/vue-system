import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import axios from './http';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'

Vue.config.productionTip = false

Vue.use(ElementUI);
vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')