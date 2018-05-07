<template>
    <div class="daily-stats animated fadeInRight">
        <div class="daily-stats__title">
            Daily System Stats
        </div>

        <stat label="Highest Bid Amount" :value="stats.highestBidAmount" currency="true" />
        <stat label="Number of Bids" :value="stats.totalNumBids" />
    </div>
</template>

<script>
import Stat from './Stat';

export default {
    name: 'ActivityFeed',
    components: {
        Stat
    },
    props: ['stats'],
    data: function() {
        return {};
    }
};
</script>

<style>
.daily-stats {
    z-index: 10000;
    position: fixed;
    bottom: 80px;
    right: 80px;
    width: auto;
    overflow: hidden;
}

.daily-stats__title {
    padding-bottom: 20px;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    border-bottom: 1px solid #fff;
}
</style>
