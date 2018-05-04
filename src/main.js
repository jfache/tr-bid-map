import Vue from 'vue';
import VueCurrencyFilter from 'vue-currency-filter';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueCurrencyFilter, {
    symbol: '$',
    thousandsSeparator: ',',
    fractionCount: 0,
    symbolPosition: 'front',
    symbolSpacing: false
});

new Vue({
    render: h => h(App)
}).$mount('#app');
