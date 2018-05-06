<template>
    <div class="stat">
        <div class="stat__value">
            {{formattedValue}}
        </div>
        <div class="stat__label">
            {{label}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Stat',
    props: ['label', 'value', 'currency'],
    data: function() {
        return {};
    },
    computed: {
        formattedValue: function() {
            if (this.currency) {
                return this.$options.filters.currency(this.value);
            } else {
                return this.value;
            }
        }
    }
};
</script>

<style>
.stat {
    margin: 25px 0;
}
.stat__label {
    font-size: 20px;
    color: #fff;
}
.stat__value {
    font-weight: bold;
    font-size: 32px;
    color: #fff;
}
</style>
