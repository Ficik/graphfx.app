<template>
    <div class="toolbar">
        <a
            href="https://github.com/ficik/graphfx"
            target="_blank"
            class="toolbar__item toolbar__item--brand"
        >
            GraphFX
        </a>
        <SaveSelect
            class="toolbar__item toolbar__item--input-select"
            v-model="selectedSaveSlot"
        />
        <button
            class="toolbar__item toolbar__item--btn"
            @click="onLoad"
        >
            Load
        </button>
        <button
            class="toolbar__item toolbar__item--btn"
            @click="onSave"
        >
            Save
        </button>
        <button
            class="toolbar__item toolbar__item--btn"
            @click="onImport"
        >
            Import
        </button>
        <button
            class="toolbar__item toolbar__item--btn"
            @click="onExport"
        >
            Export
        </button>
    </div>
</template>
<script>
import SaveSelect from './SaveSelect.vue';
import {load, save} from './persistent';
import {downloadBlob} from '../helpers/download.js';
import {loadFile} from '../helpers/loadFile.js';
import {Graph} from 'graphfx';

const SAVE_SLOT_KEY = 'GRAPHFX__SELECTED_SAVE_SLOT';

export default {
    components: {
        SaveSelect,
    },
    props: {
        graph: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            saveSlot: localStorage.getItem(SAVE_SLOT_KEY) || 'My first graph',
        }
    },
    computed: {
        selectedSaveSlot: {
            get() {
                return this.saveSlot;
            },
            set(val) {
                this.saveSlot = val;
                localStorage.setItem(SAVE_SLOT_KEY, val);
            }
        },
    },
    mounted() {
        this.onLoad();
    },
    methods: {
        onLoad() {
            this.$emit('update:graph', load(this.selectedSaveSlot));
        },
        onSave() {
            save(this.selectedSaveSlot, this.graph);
        },
        async onImport() {
            const definition = JSON.parse(await loadFile('readAsText', 'application/json'));
            const graph = Graph.deserialize(definition);
            this.$emit('update:graph', graph);
        },
        onExport() {
            const data = JSON.stringify(this.graph.serialize(), null, 2);
            const file = new Blob([data], {type: 'application/json'});
            downloadBlob(file, `${this.selectedSaveSlot}.json`);
        }
    }
}
</script>
<style>
.toolbar {
    display: flex;
    background-color: #333;
    color: white;
}

.toolbar__item {
    box-sizing: border-box;
    margin-right: 1em;
    height: 25px;
}

.toolbar__item--btn {
    background-color: transparent;
    border: none;
    border-radius: var(--border-radius);
    padding: 4px 6px;
    color: inherit;
    cursor: pointer;
}

.toolbar__item--btn:hover {
    background-color: rgba(255,255,255,0.1);
}

.toolbar__item--brand {
    color: inherit;
    font-weight: bold;
    text-decoration: none;
    padding: 4px 6px;
}
</style>