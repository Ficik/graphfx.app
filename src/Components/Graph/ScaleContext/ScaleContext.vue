<template>
    <div
        :class="{'scale-context--dragged': dragStartPos}"
        class="scale-context"
    >
        <div
            class="scale-context__active-area"
            @wheel="onWheel"
            @click="$emit('click', $event)"
            @contextmenu="$emit('contextmenu', $event)"
            @mousemove="onMouseMove"
            @dragstart="onDragStart"
            @mouseup="onDragEnd"
            draggable
        >

        </div>
        <div>
            <slot name="scale-only"></slot>
        </div>
        <div
            :style="{
                transformOrigin: 'top left',
                transform: transform,
            }"
        >
            <slot></slot>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            scale: 1,
            dragStartPos: null,
            dragOffset: {x: 0, y: 0},
        }
    },
    computed: {
        transform() {
            return `translate(${this.dragOffset.x}px, ${this.dragOffset.y}px) scale(${this.scale})`;
        }
    },
    methods: {
        emitChange() {
            this.$emit('change', {
                    scale: this.scale,
                    offset: this.dragOffset,
                });
        },
        onWheel(event) {
            console.log(event);
            this.scale += Math.sign(event.wheelDelta) * 0.1;
            this.$nextTick(this.emitChange);
        },
        onDragStart(event) {
            event.preventDefault();
            this.dragStartPos = {
                x: event.clientX - this.dragOffset.x,
                y: event.clientY - this.dragOffset.y,
            }
        },
        onDragEnd(event) {
            this.dragStartPos = null;
        },
        onMouseMove(event) {
            if (this.dragStartPos) {
                this.dragOffset = {
                    x: event.clientX - this.dragStartPos.x,
                    y: event.clientY - this.dragStartPos.y,
                }
                this.$nextTick(this.emitChange);
            }
        },
    },
    mounted() {
        // this.$el.addEventListener('wheel', this.onWheel);
    }
}
</script>
<style>
.scale-context {
    position: relative;
}
.scale-context--dragged {
    cursor: move;
}

.scale-context__active-area {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
}

.scale-context--dragged .scale-context__active-area {
    z-index: 100;
}
</style>