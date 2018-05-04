<template>
    <div id="app">
        <activity-feed :activities="activities" />
        <mapbox
            access-token="pk.eyJ1IjoibHV1a3ZhbmJhYXJzIiwiYSI6ImNqZ3Jia3pyMjAwa3Myd2xlczhzYWk3NWsifQ.VNQ_VAyPIF2BaZEo4lztFw"
            :map-options="mapOptions"
            @map-load="mapLoaded">
        </mapbox>
        <div class="actions">
            <a @click="centerTo('ontario')">Ontario</a>
            <a @click="centerTo('sf')">SF</a>
        </div>
    </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';
import ActivityFeed from './components/ActivityFeed';
import dealers from './data/dealers.json';
import pushService from './services/push-service';
import eventBus from './services/event-bus';
import eventConfig from './constants/event-config';
import { findWhere } from 'underscore';

const defaultOptions = {
    style: 'mapbox://styles/luukvanbaars/cjgs2n25s000c2spelxhyopsb',
    center: [-79.383184, 43.653226],
    zoom: 10
};

// Populated on map load
let _map;

export default {
    name: 'app',
    components: {
        Mapbox,
        ActivityFeed
    },
    data: function() {
        return {
            mapOptions: defaultOptions,
            activities: []
        };
    },
    created: function() {
        var vm = this;
        pushService.openConnection();

        // Let the bids flow baby!
        eventBus.$on(eventConfig.newBid, function(bid) {
            console.log('Received new bid!', bid);
            vm.updateActivityFeed(bid);
        });
    },
    methods: {
        updateActivityFeed({ maxBidAmount, topBidderId, tradeId }) {
            // Check if we have this key
            let key = `${tradeId}-${maxBidAmount}-${topBidderId}`;
            let activity = findWhere(this.activities, {
                key: key
            });

            if (!activity) {
                this.activities.unshift({
                    key: `${tradeId}-${maxBidAmount}-${topBidderId}`,
                    maxBidAmount,
                    topBidderId,
                    tradeId
                });
            }
        },
        placeDealers(map) {
            let features = [];

            dealers.forEach(function(dealer) {
                features.push({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [dealer.longitude, dealer.latitude]
                    },
                    properties: {
                        title: dealer.name,
                        icon: 'harbor'
                    }
                });
            });

            map.addLayer({
                id: 'dealers',
                type: 'symbol',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: features
                    }
                },
                layout: {
                    'icon-image': '{icon}-15'
                }
            });
        },
        centerTo(location) {
            console.log(location);
            let center;
            let zoom = 10;
            switch (location) {
                case 'ontario':
            }
        },
        mapLoaded(map) {
            _map = map;
            this.placeDealers(map);
        }
    }
};
</script>

<style>
@font-face {
    font-family: 'Gibson';
    src: url('https://s3.amazonaws.com/tr-prod-assets/web/font/CT0199-GibsonWOFF/Gibson-Regular-webfont.woff')
        format('woff');
    font-weight: 400;
    font-style: normal;
}

@font-face {
    font-family: 'Gibson';
    src: url('https://s3.amazonaws.com/tr-prod-assets/web/font/CT0199-GibsonWOFF/Gibson-SemiBold-webfont.woff')
        format('woff');
    font-weight: 600;
    font-style: normal;
}

body {
    margin: 0;
}

#app {
    font-family: 'Gibson', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

#map {
    width: 100%;
    height: 90vh;
}
</style>
