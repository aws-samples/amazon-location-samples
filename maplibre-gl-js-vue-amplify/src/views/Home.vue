<template>
    <div class="home">
        <h2>Amazon Location Service x Amplify Geo</h2>
        <MapPane></MapPane>
        <amplify-sign-out></amplify-sign-out>
    </div>
</template>

<script>
import MapPane from '@/components/MapPane.vue';

export default {
    name: 'Home',
    components: {
        MapPane,
    },
};
</script>
