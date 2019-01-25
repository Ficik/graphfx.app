<template>
    <input
        v-if="isEditing"
        @blur="isEditing = false"
        type="text"
        v-model="currentValue"
    >
    <span
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
