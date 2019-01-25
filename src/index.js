import Vue from 'vue';
import App from './Components/App.vue';
import './global.css';

new Vue({
    el: '#app',
    render(h) {
        return h(App)
    },
})