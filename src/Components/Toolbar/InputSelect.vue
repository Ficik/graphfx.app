<template>
    <div class="input-select">
        <input
            class="input-select__input"
            :list="datalistId"
            autocomplete="off"
            type="text"
            v-model="currentValue"
        >
        <datalist :id="datalistId">
            <option
                v-for="option in options"
                :key="option">
                {{ option }}
            </option>
        </datalist>
    </div>
</template>
<script>
export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        options: {
            type: Array,
            default: [],
        },
        value: {
            type: String,
            required: true
        }
    },
    computed: {
        datalistId() {
            return `datalist-${this.name}`;
        },
        currentValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        }
    }
}
</script>
<style>
.input-select {

}

.input-select__input {
    border-radius: var(--border-radius);
    border: none;
    background-color: rgba(255,255,255,0.1);
    height: 100%;
    color: white;
    padding: 2px 4px;
}

</style>