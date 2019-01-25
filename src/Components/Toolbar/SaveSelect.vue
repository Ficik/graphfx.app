<template>
    <InputSelect
        @input="$emit('input', $event)"
        :value="value"
        name="save"
        :options="options"
    />
</template>
<script>
import InputSelect from './InputSelect.vue';
import {listSaves} from './persistent.js';

export default {
    components: {
        InputSelect,
    },
    props: {
        value: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            options: []
        };
    },
    created() {
        this.updateSaves();
    },
    methods: {
        updateSaves() {
            this.options = listSaves();
        }
    }

}
</script>

