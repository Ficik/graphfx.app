import Vue from 'vue';
import App from './Components/App.vue';
import './global.css';
// Vue.config.performance = true

Vue.prototype.$store = new Vue({
    data() {
        return {
            isPreviewEnabled: true,
        };
    }
});



new Vue({
    el: '#app',
    render(h) {
        return h(App)
    },
})