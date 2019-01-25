<template>
    <select
        class="select-input"
        v-model="io.value">
        <option
            v-for="value in io.definition.enum"
            :value="value"
            :key="value"
        >{{ value }}</option>
    </select>
</template>
<script>
export default {
    props: {
        type: {
            type: null,
            required: true,
        },
        io: {
            type: null,
            required: true,
        }
    }
}
</script>
<style>
.select-input {
    background-color: rgba(0,0,0,0.8);
    border: none;
    color: white;
    padding: 2px 4px;
    border-radius: 5px;
}

</style>
