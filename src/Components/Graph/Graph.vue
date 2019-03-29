<template>
    <div class="graph">
        <ScaleContext
            @change="onContextChange"
            @click="showContextMenu"
            @contextmenu="showContextMenu"
            :transform.sync="transform"
        >
            <Connections
                class="graph__connections"
                :inputs="inputPositions"
                :outputs="outputPositions"

            />

            <Draggable
                v-for="node in graph.nodes"
                :key="`drag-${node.node.uid}`"
                handle=".node__title"
                @move="updateNodePosition(node, $event)"
            >
                <Node
                    class="graph__node"
                    :style="{transform: `translate(${node.x}px, ${node.y}px)`}"
                    :node="node.node"
                    :key="node.node.uid"
                    ref="node"
                    :selectedInput="selectedInput"
                    :selectedOutput="selectedOutput"
                    @outputSelected="selectedOutput = $event"
                    @inputSelected="selectedInput = $event"
                    @removeNode="removeNode"
                />
            </Draggable>

            <ContextMenu
                :open="!!contextMenuPosition"
                :position="contextMenuPosition"
                :items="availableNodes"
                @selected="addNode"
            />
        </ScaleContext>
    </div>
</template>
<script>
import * as nodes from 'graphfx/src/nodes';
import Node from './Node';
import Draggable from './Drag/Draggable.js';
import ContextMenu from './ContextMenu';
import Connections from './Connections';
import ScaleContext from './ScaleContext';

export default {
    components: {
        ContextMenu,
        Draggable,
        Node,
        Connections,
        ScaleContext,
    },
    props: {
        graph: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            selectedOutput: null,
            selectedInput: null,
            boundingBox: null,
            contextMenuPosition: null,
            inputPositions: null,
            outputPositions: null,
            scaleContext: {offset: {x: 0, y: 0}, scale: 1},
            transform: null,
        }
    },
    watch: {
        selectedOutput() {
            this.tryConnectIO();
        },
        selectedInput() {
            this.tryConnectIO();
        },
        graph: {
            handler() {
                this.$nextTick(this.updateDimensions);
            }
        }
    },
    methods: {
        onContextChange(scaleContext) {
            this.scaleContext = scaleContext;
            this.updateDimensions();
        },
        showContextMenu(event) {
            const {x, y} = event;
            const {offsetX, offsetY} = event;
            if (this.selectedOutput || this.selectedInput) {
                this.selectedOutput = null;
                this.selectedInput = null;
            } else if (this.contextMenuPosition) {
                this.contextMenuPosition = null;
            } else {
                this.contextMenuPosition = {x, y};
            }
        },
        updateNodePosition(node, event) {
            const {x, y} = this.transform(event);
            node.x = x;
            node.y = y;
            this.drawConnections();
        },
        tryConnectIO() {
            if (this.selectedInput && this.selectedOutput) {
                this.selectedInput.connect(this.selectedOutput);
                this.selectedInput = null;
                this.selectedOutput = null;
                this.drawConnections();
            }
        },
        drawConnections() {
            try {
                const flattenObjectArray = (ary) =>
                    ary.reduce((acc, nxt) => Object.assign(acc, nxt), {});

                this.inputPositions = flattenObjectArray(this.$refs.node
                    .map((vm) => {
                        const pos = vm.inputPositions();
                        for (let id of Object.keys(pos)) {
                            pos[id].rect = this.transform(pos[id].rect);
                        }
                        return pos;
                    }))

                this.outputPositions = flattenObjectArray(this.$refs.node
                    .map((vm) => {
                        const pos = vm.outputPositions();
                        for (let id of Object.keys(pos)) {
                            pos[id].rect = this.transform(pos[id].rect);
                        }
                        return pos;
                    }));
            } catch (err) {
                console.warn('drawConnection', err);
            }
        },
        addNode({x, y, item: {node}}) {
            this.graph.nodes.push({
                x, y,
                node: new node(),
            });
            this.contextMenuPosition = null;
        },
        removeNode(nodeToRemove) {
            const index = this.graph.nodes.findIndex(({node}) => node === nodeToRemove);
            this.graph.nodes.splice(index, 1);
            this.$nextTick(this.drawConnections);
        },
        updateDimensions() {
            this.boundingBox = this.$el.getBoundingClientRect();
            this.drawConnections();
        }
    },
    computed: {
        availableNodes() {
            return Object.keys(nodes)
                .map((name) => ({
                    label: name,
                    node: nodes[name],
                }))
        },
    },
}
</script>
<style>
.graph {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(#333333, #151515);
    top: 0;
    left: 0;
}
.graph__connections {
    position: absolute;
}

.graph__node {
    position: absolute;
}

.graph__bg {
    position: absolute;
    top: 0;
    left: 0;
}
</style>

