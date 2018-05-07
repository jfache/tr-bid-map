<template>
    <div id="app">
        <div id="overlay"></div>
        <activity-feed :activities="activities" />
        <daily-stats :stats="stats" />
        <transition name="fade">
            <div class="area-name" v-if="!isMoving">
                {{areas[areaIndex].name}}
            </div>
        </transition>
        <mapbox
            access-token="pk.eyJ1IjoibHV1a3ZhbmJhYXJzIiwiYSI6ImNqZ3Jia3pyMjAwa3Myd2xlczhzYWk3NWsifQ.VNQ_VAyPIF2BaZEo4lztFw"
            :map-options="mapOptions"
            :nav-control="{show: false}"
            @map-load="mapLoaded"
            @map-movestart="mapMoveStart"
            @map-moveend="mapMoveEnd">
        </mapbox>
        <div id="debug">
            <div @click="panMap">Pan Map</div>
            <div @click="getMapInfo">Map Info</div>
        </div>
    </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue';
import ActivityFeed from './components/ActivityFeed';
import DailyStats from './components/DailyStats';
import trades from './data/trades.json';
import dealers from './data/dealers.json';
import dealerService from './services/dealer-service';
import pushService from './services/push-service';
import eventBus from './services/event-bus';
import eventConfig from './constants/event-config';
import areas from './constants/areas';
import { findWhere } from 'underscore';
import { getRandomInt } from './services/utils-service';
import turf from 'turf';

const defaultOptions = {
    style: 'mapbox://styles/luukvanbaars/cjgsa6mk6000w2rnkmnn1em4t',
    center: areas[0].center,
    zoom: areas[0].zoom
};

const defaultCircleRadius = {
    stops: [[5, 1.75], [6, 2.5]]
};

// Populated on map load
let _map;

export default {
    name: 'app',
    components: {
        Mapbox,
        ActivityFeed,
        DailyStats
    },
    data: function() {
        return {
            mapOptions: defaultOptions,
            activities: [],
            stats: {
                highestBidAmount: 0,
                totalNumBids: 0
            },
            bids: [],
            areaIndex: 0,
            areas: areas,
            isMoving: false
        };
    },
    created: function() {
        var vm = this;
        // pushService.openConnection();

        // Let the bids flow baby!
        eventBus.$on(eventConfig.newBid, function(bid) {
            let key = `${bid.tradeId}-${bid.maxBidAmount}-${
                bid.topBidder.companyId
            }`;

            if (vm.bids.includes(key)) {
                return;
            }

            vm.bids.push(key);

            vm.updateActivityFeed(bid, key);
            vm.animateDots(bid, key);
        });
    },
    methods: {
        animateDots({ maxBidAmount, topBidder, tradeId, tradeRegion }, key) {
            let seller = dealerService.getDealerFromTradeId(
                tradeId,
                tradeRegion
            );
            let buyer = dealerService.getDealer(
                topBidder.companyId,
                topBidder.region
            );

            if (!buyer.longitude || !seller.longitude) {
                return;
            }

            var origin = [buyer.longitude, buyer.latitude];
            var destination = [seller.longitude, seller.latitude];

            var point = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: origin
                        }
                    }
                ]
            };

            var originPoint = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: origin
                        }
                    }
                ]
            };

            var route = {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: [origin, destination]
                        }
                    }
                ]
            };

            // Calculate the distance in kilometers between route start/end point.
            var lineDistance = turf.lineDistance(
                route.features[0],
                'kilometers'
            );

            var arc = [];

            // Number of steps to use in the arc and animation, more steps means
            // a smoother arc and animation, but too many steps will result in a
            // low frame rate
            var steps = Math.min(Math.floor(lineDistance / 20), 70);

            // Draw an arc between the `origin` & `destination` of the two points
            for (var i = 0; i < lineDistance; i += lineDistance / steps) {
                var segment = turf.along(route.features[0], i, 'kilometers');
                arc.push(segment.geometry.coordinates);
            }

            // Make sure to always have the destination included
            arc.push(destination);

            // Update the route with calculated arc coordinates
            route.features[0].geometry.coordinates = arc;

            // Used to increment the value of the point measurement against the route.
            var counter = 0;

            // Add a source and layer displaying a point which will be animated in a circle.
            _map.addSource(`route-${key}`, {
                type: 'geojson',
                data: route
            });

            _map.addSource(`origin-point-${key}`, {
                type: 'geojson',
                data: originPoint
            });

            _map.addSource(`point-${key}`, {
                type: 'geojson',
                data: point
            });

            _map.addLayer({
                id: `route-${key}`,
                source: `route-${key}`,
                type: 'line',
                paint: {
                    'line-width': 2,
                    'line-color': '#FFF',
                    'line-opacity': 0.75
                }
            });

            _map.addLayer({
                id: `origin-point-${key}`,
                source: `origin-point-${key}`,
                type: 'circle',
                paint: {
                    'circle-color': '#FFF',
                    'circle-radius': defaultCircleRadius
                }
            });

            _map.addLayer({
                id: `point-${key}`,
                source: `point-${key}`,
                type: 'circle',
                paint: {
                    'circle-color': '#FFF',
                    'circle-radius': 2
                }
            });

            function animate() {
                // Update point geometry to a new position based on counter denoting
                // the index to access the arc.
                point.features[0].geometry.coordinates =
                    route.features[0].geometry.coordinates[counter];

                // Update the source with this new data.
                _map.getSource(`point-${key}`).setData(point);

                // Request the next frame of animation so long the end has not been reached.
                if (counter < steps) {
                    requestAnimationFrame(animate);
                } else {
                    setTimeout(cleanup, 3000);
                }

                counter = counter + 1;
            }

            // Start the animation.
            animate(counter);

            function cleanup() {
                [`origin-point-${key}`, `point-${key}`].forEach(layer => {
                    _map.setPaintProperty(layer, 'circle-opacity', 0);
                });
                [`route-${key}`].forEach(layer => {
                    _map.setPaintProperty(layer, 'line-opacity', 0);
                });

                setTimeout(removeLayers, 500);
            }

            function removeLayers() {
                [`origin-point-${key}`, `point-${key}`, `route-${key}`].forEach(
                    layer => {
                        _map.removeLayer(layer);
                    }
                );
            }
        },
        updateDailyStats({ maxBidAmount }) {
            if (maxBidAmount > this.stats.highestBidAmount) {
                this.stats.highestBidAmount = maxBidAmount;
            }
            this.stats.totalNumBids++;
        },
        updateActivityFeed(
            { maxBidAmount, topBidder, tradeId, tradeRegion, ...rest },
            key
        ) {
            // If this is a valid bid, update daily stats
            this.updateDailyStats({ maxBidAmount, ...rest });

            let seller = dealerService.getDealerFromTradeId(
                tradeId,
                tradeRegion
            );
            let buyer = dealerService.getDealer(
                topBidder.companyId,
                topBidder.region
            );
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
                    properties: {}
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
                    'circle-radius': defaultCircleRadius
                }
            });
        },
        mapLoaded(map) {
            _map = map;
            this.placeDealers(map);
            setTimeout(this.panMap, areas[this.areaIndex].duration);
            setTimeout(this.bid, 1000);
        },
        mapMoveStart() {
            this.isMoving = true;
        },
        mapMoveEnd() {
            this.isMoving = false;
        },
        panMap() {
            this.areaIndex++;
            if (this.areaIndex >= areas.length) {
                this.areaIndex = 0;
            }
            var nextArea = areas[this.areaIndex];

            _map.flyTo({
                center: nextArea.center,
                zoom: nextArea.zoom,
                pitch: nextArea.pitch,
                bearing: nextArea.bearing,
                speed: 0.25
            });

            setTimeout(this.panMap, nextArea.duration);
        },
        getMapInfo() {
            console.log(_map.getCenter());
            console.log(_map.getZoom());
        },
        bid() {
            let randomTrade = trades[getRandomInt(0, trades.length - 1)];
            let randomBidder = dealers[getRandomInt(0, dealers.length - 1)];
            let message = {
                maxBidAmount: getRandomInt(50, 15000),
                tradeId: randomTrade.tradeID,
                tradeRegion: randomTrade.region,
                topBidder: {
                    companyId: randomBidder.id,
                    region: randomBidder.region
                }
            };
            eventBus.$emit(eventConfig.newBid, message);
            setTimeout(this.bid, getRandomInt(500, 3000));
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

#overlay {
    background-image: url('assets/gradient-overlay.png');
    background-size: cover;
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1;
}

#map {
    width: 100%;
    height: 100vh;
}

#debug {
    display: none;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10000;
}

.area-name {
    position: absolute;
    z-index: 100;
    top: 80px;
    right: 80px;
    font-weight: bold;
    color: #fff;
    font-size: 36px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
