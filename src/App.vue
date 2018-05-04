<template>
  <div id="app">
    <mapbox
        access-token="pk.eyJ1IjoibHV1a3ZhbmJhYXJzIiwiYSI6ImNqZ3Jia3pyMjAwa3Myd2xlczhzYWk3NWsifQ.VNQ_VAyPIF2BaZEo4lztFw"
        :map-options="mapOptions"></mapbox>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';

const defaultOptions = {
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-79.383184, 43.653226],
    zoom: 15
}

export default {
    name: 'app',
    components: {
        Mapbox
    },
    data: function() {
        return {
            mapOptions: defaultOptions
        }
    }
}
</script>

<style>
body {
    margin: 0;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

#map {
    width: 100%;
    height: 90vh;
}
</style>
