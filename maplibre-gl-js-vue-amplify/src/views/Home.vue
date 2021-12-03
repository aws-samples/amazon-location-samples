<template>
    <div class="home">
        <h2>Amazon Location Service x Amplify Geo</h2>
        <MapPane></MapPane>
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
