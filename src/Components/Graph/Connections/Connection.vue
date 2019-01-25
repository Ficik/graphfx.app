<template>
    <path :d="path"></path>
</template>
<script>
export default {
    props: {
        x1: {
            type: Number,
            required: true,
        },
        y1: {
            type: Number,
            required: true,
        },
        x2: {
            type: Number,
            required: true,
        },
        y2: {
            type: Number,
            required: true,
        }
    },
    computed: {
        path() {
            const halfWay = {
                x: (this.x1 + this.x2)/2,
                y: (this.y1 + this.y2)/2
            };
            const startPoint = `${this.x1} ${this.y1}`;
            const startControl = `${Math.min(halfWay.x, this.x1 - Math.max(Math.abs(halfWay.x - this.x1), 50))} ${this.y1}`;
            const endControl = `${Math.max(halfWay.x, this.x2 + Math.max(Math.abs(halfWay.x - this.x2), 50))} ${this.y2}`;
            const endPoint = `${this.x2} ${this.y2}`;
            return `M${startPoint} C ${startControl} ${endControl} ${endPoint}`
            // return `M${this.x1} ${this.y1} L ${this.x2} ${this.y2}`;
        }
    }
}
</script>
