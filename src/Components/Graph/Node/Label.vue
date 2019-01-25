<template>
    <input
        class="node-label"
        v-if="isEditing"
        ref="input"
        @blur="isEditing = false"
        type="text"
        v-model="currentValue"
    >
    <span
        class="node-label"
        :class="{'node-label--active': currentValue}"
        v-else
        @click.stop="isEditing = true"
    >
        {{ currentValue || '+label' }}
    </span>
</template>
<script>
export default {
    props: {
        value: {
            type: String,
            default: null,
        }
    },
    data() {
        return {
            isEditing: false,
        }
    },
    watch: {
        isEditing(isEditing) {
            if(isEditing) {
                this.$nextTick(() => {
                    this.$refs.input.focus();
                });
            }
        }
    },
    computed: {
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
.node-label {
    opacity: 0.3;
    font-size: 0.85em;
    padding: 2px 0;
}
.node-label--active {
    background-color: var(--primary-color);
    color: black;
    font-weight: bold;
    opacity: 1;
    padding: 2px 4px;

}

</style>