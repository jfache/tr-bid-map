<template>
    <div class="activity animated fadeInLeft">
        <div class="activity__line"></div>
        <div class="activity__company">
            {{buyer.name}}
        </div>
        <div class="activity__bid">
            {{bidAmount | currency}}
        </div>
        <div class="activity__company">
            {{seller.name}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Activity',
    props: ['buyer', 'seller', 'bidAmount'],
    data: function() {
        return {};
    },
    created: function() {
        console.log('Activity created!');
    }
};
</script>

<style>
.activity {
    position: relative;
    margin: 10px 0;
    background: rgba(0, 0, 0, 0.05);
    text-align: center;
    font-size: 13px;
    color: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
}

.activity__line {
    position: absolute;
    z-index: -1;
    top: 50%;
    width: 100%;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
}

.activity__company {
    padding: 8px;
}

.activity__bid {
    display: inline-block;
    padding: 2px 30px;
    background: #82bc00;
    border-radius: 20px;
    color: #fff;
    text-align: center;
    font-weight: bold;
}
</style>
