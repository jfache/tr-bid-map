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
    top: 0;
    left: 5%;
    height: 80vh;
    width: 40vh;
    margin-top: 5vh;
    padding: 40px;
    background: #fff;
    box-shadow: 0px 15px 30px 0 rgba(0, 0, 0, 0.25);
    border-radius: 20px;
    overflow: hidden;
}

.activity-feed__title {
    padding-bottom: 20px;
    color: #000;
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
    border-bottom: 2px solid #000;
}

.activity-feed__list {
    margin-top: 20px;
}
</style>
