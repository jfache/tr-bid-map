<template>
    <div id="app">
        <activity-feed :activities="activities" />
        <mapbox
            access-token="pk.eyJ1IjoibHV1a3ZhbmJhYXJzIiwiYSI6ImNqZ3Jia3pyMjAwa3Myd2xlczhzYWk3NWsifQ.VNQ_VAyPIF2BaZEo4lztFw"
            :map-options="mapOptions"
            @map-load="mapLoaded">
        </mapbox>
    </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';
import ActivityFeed from './components/ActivityFeed';
import dealers from './data/dealers.json';
import dealerService from './services/dealer-service';
import pushService from './services/push-service';
import eventBus from './services/event-bus';
import eventConfig from './constants/event-config';
import { findWhere } from 'underscore';

const defaultOptions = {
    style: 'mapbox://styles/luukvanbaars/cjgsa6mk6000w2rnkmnn1em4t',
    center: [-96.898047, 43.999263],
    zoom: 3
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
            vm.updateActivityFeed(bid);
            vm.animateDots(bid);
        });
    },
    methods: {
        animateDots({ maxBidAmount, topBidder, tradeId }) {
            let key = `${tradeId}-${maxBidAmount}-${topBidder.id}`;
            let seller = dealerService.getDealerFromTradeId(tradeId);
            let buyer = dealerService.getDealer(topBidder.companyId);

            _map.addLayer({
                id: `bid-${key}`,
                type: 'circle',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [
                                        seller.longitude,
                                        seller.latitude
                                    ]
                                }
                            },
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [
                                        buyer.longitude,
                                        buyer.latitude
                                    ]
                                }
                            }
                        ]
                    }
                },
                paint: {
                    'circle-color': '#FFF'
                }
            });
        },
        updateActivityFeed({ maxBidAmount, topBidder, tradeId }) {
            let key = `${tradeId}-${maxBidAmount}-${topBidder.id}`;
            let activity = findWhere(this.activities, {
                key: key
            });

            // If we already have this activity in the feed, ignore it
            if (activity) {
                return;
            }

            let seller = dealerService.getDealerFromTradeId(tradeId);
            let buyer = dealerService.getDealer(topBidder.companyId);
            let bidAmount = maxBidAmount;

            this.activities.unshift({
                key,
                seller,
                buyer,
                bidAmount
            });
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
                        bids: Math.random() * (10 - 1) + 1,
                        icon: 'harbor'
                    }
                });
            });
            map.addLayer({
                id: 'dealers',
                type: 'circle',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: features
                    }
                },
                paint: {
                    'circle-color': '#333',
                    'circle-radius': {
                        stops: [[5, 1.75], [6, 3]]
                    }
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
    height: 100vh;
}
</style>
