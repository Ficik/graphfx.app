<template>
    <svg
        :viewBox="`${dimensions.x} ${dimensions.y} ${dimensions.width} ${dimensions.height}`"
        class="connections"
        :style="{
            left: dimensions.x,
            top: dimensions.y,
            width: dimensions.width,
            height: dimensions.height,
        }"
        >
        <Connection
            v-for="connection in connections"
            :key="connection.inputId"
            v-bind="connection"
            class="connections__connection"
        ></Connection>
    </svg>
</template>
<script>
import Connection from './Connection.vue';
import _ from 'lodash';

export default {
    components: {
        Connection,
    },
    props: {
        inputs: {
            type: Object,
            default: () => {},
        },
        outputs: {
            type: Object,
            default: () => {},
        }
    },
    computed: {
        dimensions() {
            const xValues = _.chain(this.connections)
                .map('x1')
                .concat(_.map(this.connections, 'x2'))
                .value();
            const yValues = _.chain(this.connections)
                .map('y1')
                .concat(_.map(this.connections, 'y2'))
                .value();
            const x = Math.floor(_.min(xValues)) - 300;
            const width = Math.floor(_.max(xValues) - x) + 300;
            const y = Math.floor(_.min(yValues)) - 100;
            const height = Math.floor(_.max(yValues) - y) + 100;
            return {x, y, width, height};
        },
        connections() {
            return _.chain(this.inputs)
                .omitBy(({output}) => _.isNil(output))
                .map(({rect, output}, inputId) => {
                    const outputPos = this.outputs[output.id];
                    return {
                        inputId,
                        x1: rect.left,
                        y1: rect.top + rect.height / 2,
                        x2: outputPos.rect.right,
                        y2: outputPos.rect.top + outputPos.rect.height / 2,
                    };
                })
                .value();
        }
    }
}
</script>
<style>
.connections {
    background-color: rgba(255,255,255, 0.1);
    border-radius: 5px;
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.4);
    pointer-events: none;
}

.connections__connection {
    stroke-width: 3px;
    stroke: orange;
    fill: transparent;
}
</style>
