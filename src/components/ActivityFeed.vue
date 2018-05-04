<template>
    <div class="activity-feed">
        <div class="activity-feed__title">
            Activity Feed
        </div>
        <div class="activity-feed__list">
            <div v-for="activity in activities" :key="activity.key">
                <activity v-bind="activity"/>
            </div>
        </div>
        <div class="activity-feed__gradient"></div>
    </div>
</template>

<script>
import Activity from './Activity';

export default {
    name: 'ActivityFeed',
    components: {
        Activity
    },
    props: ['activities'],
    data: function() {
        return {};
    }
};
</script>

<style>
.activity-feed {
    z-index: 10000;
    position: fixed;
    top: 80px;
    left: 80px;
    height: calc(100% - 240px);
    width: 40vh;
    padding: 40px;
    background: #fff;
    box-shadow: 0px 15px 30px 0 rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    overflow: hidden;
}

.activity-feed__gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20vh;
    background: -moz-linear-gradient(top, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(
        top,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 100%
    ); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 100%
    ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */
}

.activity-feed__title {
    padding-bottom: 20px;
    color: #000;
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 1px solid #707070;
}

.activity-feed__list {
    margin-top: 20px;
}
</style>
