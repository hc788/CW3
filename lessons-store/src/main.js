import Vue from 'vue'
import App from './App.vue'
import Lessons from './components/Lessons.vue'
import Checkout from './components/Lessons.vue'

//import './style.css'
Vue.config.productionTip = false
Vue.component('lessons', Lessons)
Vue.component('checkout', Checkout)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
