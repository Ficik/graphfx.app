<template>
    <input
        class="string-input"
        v-model="value"
        :type="
            type === 'Number' ? 'number' :
            type === 'Color' ? 'color' :
            type === 'Boolean' ? 'checkbox' :
            'text'
        "
    >
</template>
<script>
export default {
    props: {
        io: {
            type: null,
            required: true,
        },
        type: {
            type: String,
            required: true,
        }
    },
    computed: {
        value: {
            get() {
                return this.io.value;
            },
            set(val) {
                if (this.type === 'Number') {
                    this.io.value = parseFloat(val)
                } else {
                    this.io.value = val;
                }
            }
        }
    },
    methods: {
        onChange($event) {
            this.value = $event.target.value;
        }
    }
}
</script>
<style>
.string-input {
    background-color: rgba(0,0,0,0.8);
    border: none;
    color: white;
    padding: 2px 4px;
    border-radius: 5px;
}

</style>