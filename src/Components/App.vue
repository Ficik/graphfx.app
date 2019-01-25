<template>
    <div class="app">
        <Toolbar
            :graph.sync="graph"
            class="app__toolbar"
        />
        <Graph
            class="app__scene"
            :graph="graph"
        />
    </div>
</template>
<script>
import Toolbar from './Toolbar';
import Graph from './Graph.vue';

export default {
    components: {
        Toolbar,
        Graph,
    },
    data() {
        return {
            graph: {nodes: []},
        }
    },
};
</script>
<style>
.app {
    position: fixed;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    font-family: sans-serif;
    font-size: 12px;
}

.app__toolbar {
    padding: 10px;
    text-align: right;
}
</style>
