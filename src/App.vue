<template>
  <div id="app">
    <mapbox
        access-token="pk.eyJ1IjoibHV1a3ZhbmJhYXJzIiwiYSI6ImNqZ3Jia3pyMjAwa3Myd2xlczhzYWk3NWsifQ.VNQ_VAyPIF2BaZEo4lztFw"
        :map-options="mapOptions"
        @map-click="mapClicked"></mapbox>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';

const defaultOptions = {
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-79.383184, 43.653226],
    zoom: 15
};

export default {
    name: 'app',
    components: {
        Mapbox
    },
    data: function() {
        return {
            mapOptions: defaultOptions
        };
    },
    methods: {
        mapClicked(map) {
            map.addLayer({
                id: 'points',
                type: 'symbol',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [-77.03238901390978, 38.913188059745586]
                                },
                                properties: {
                                    title: 'Mapbox DC',
                                    icon: 'monument'
                                }
                            },
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [-122.414, 37.776]
                                },
                                properties: {
                                    title: 'Mapbox SF',
                                    icon: 'harbor'
                                }
                            },
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: defaultOptions.center
                                },
                                properties: {
                                    title: 'Test Toronto',
                                    icon: 'account'
                                }
                            }
                        ]
                    }
                },
                layout: {
                    'icon-image': '{icon}-15',
                    'text-field': '{title}',
                    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                    'text-offset': [0, 0.6],
                    'text-anchor': 'top'
                }
            });
        }
    }
};
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
