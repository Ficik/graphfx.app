<template>
    <div
        class="node"
    >
        <div
            class="node__title"
        >{{node.name}}</div>
        <div class="node__vars node__vars--input">
            <div
                v-for="(type, name) in node.in.variables"
                :key="name"

                class="node__var node-var node-var--input"
                :class="{'node-var--selected': node.in[name] === selectedInput }"
            >
                <div
                    class="node-var__target"
                    :ref="`in-${name}`"
                ></div>
                <div
                    class="node-var__label"
                    @click="$emit('inputSelected', node.in[name])"
                >
                {{ name }} <!--<i>{{typeName(type)}}</i> -->

                <span
                    class="node__unlink"
                    v-if="node.in[name].output"
                    @click.stop="node.in[name].disconnect()"
                >&times;</span>
                <br>
                <Label
                    class="node__label"
                    v-model="node.in[name].label"
                />
                </div>
                <Value
                    :io="node.in[name]"
                    direction="input"
                    @change="(value) => node.in[name].value = value"
                    class="node-var__value"
                />

            </div>
        </div>
        <div  class="node__vars node__vars--output">
            <div
                v-for="(type, name) in node.out.variables"
                :key="name"

                class="node__var node-var node-var--output"
                :class="{'node-var--selected': node.out[name] === selectedOutput }"
            >
                <div
                    class="node-var__target"
                    :ref="`out-${name}`"
                ></div>
                <div
                    class="node-var__label"
                    @click="$emit('outputSelected', node.out[name])"
                >
                    {{ name }} <!--<i>{{typeName(type)}}</i>-->
                    <br>
                    <Label
                        class="node__label"
                        v-model="node.out[name].label"
                    />
                </div>
                <Value
                    :io="node.out[name]"
                    direction="output"
                    class="node-var__value"
                />
            </div>
        </div>
        <div
            class="node__remove"
            @click="removeNode"
        >
            &times;
        </div>
    </div>
</template>
<script>
import Label from './Label';
import Value from './Value';

export default {
    components: {
        Label,
        Value,
    },
    props: {
        selectedInput: {
            type: Object,
            default: null
        },
        selectedOutput: {
            type: Object,
            default: null
        },
        node: {
            type: Object,
            required: true,
        }
    },
    methods: {
        typeName(type) {
            return Array.isArray(type) ? 'Option' : type;
        },
        outputPositions() {
            const outs = {};
            for (let out in this.node.out.variables) {
                outs[this.node.out[out].id] = {
                    rect: this.$refs[`out-${out}`][0].getBoundingClientRect(),
                }
            }
            return outs;
        },
        inputPositions() {
            const ins = {};
            for (let i in this.node.in.variables) {
                ins[this.node.in[i].id] = {
                    output: this.node.in[i].output,
                    rect: this.$refs[`in-${i}`][0].getBoundingClientRect(),
                }
            }
            return ins;
        },
        removeNode() {
            this.$emit('removeNode', this.node);
        }
    }
}
</script>
<style>
.node-var {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    position: relative;

}
.node-var__label {
  width: 5em;
  display: inline-block;
}

.node-var__value {
  width: 5em;
  display: inline-block;
}

.node-var--selected {
    font-weight: bold;
}

.node-var--input {
    padding-left: 4px;
}

.node-var--output {
    flex-direction: row-reverse;
}

.node-var__target {
    content: '';
    position: absolute;
    width: 5px;
    height: 10px;
}

.node-var--input .node-var__target  {
    background-color: #36d236;
    left: -5px;
    border-radius: 50% 0 0 50% ;
}

.node-var--output .node-var__target  {
    background-color: orange;
    right: -5px;
    border-radius: 0 50% 50% 0;
}

.node {
    margin: 5px;
    padding: 0 0 5px 0;
    display: grid;
    flex-direction: row;
    background-color: rgba(40,40,40,0.8);
    color: white;
    border-radius: 5px;
    box-shadow: 1px 1px 5px rgba(0,0,0,0.35);
    grid-gap: 5px;
    grid-template-areas:
        "title title"
        "in  out";
}
.node__title {
    grid-area: title;
    text-align: center;
    font-weight: bold;
    padding: 5px;
    border-radius: 5px;
    background:
        linear-gradient(
            to bottom,
            rgba(255,255,255, 0.05),
            transparent
        )
}

.node__label {
    max-width: 100%;
}

.node__unlink {
    background-color: white;
    width: 0.85em;
    display: inline-flex;
    height: 0.85em;
    border-radius: 50%;
    color: black;
    justify-content: center;
    align-items: center;
    line-height: 0.85em;
    font-size: 0.85em;
    opacity: 0.75;
    cursor: pointer;
    transition: opacity 120ms;
    margin-left: 0.5em;
}

.node__unlink:hover {
    opacity: 1;
}

.node__var {
    margin-bottom: 2px
}

.node__vars--input {
    grid-area: in;
}

.node__vars--output {
    grid-area: out;
}

.node__remove {
    position: absolute;
    top: -20px;
    right: -20px;
    background-color: red;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.3;
    transition: opacity 120ms;
    cursor: pointer;
}

.node__remove:hover {
    opacity: 1;
}
</style>
