<template>
    <div
        class="scene"
    >
        <div
            class="scene__backdrop"
            @wheel="onMouseWheel"
            @click="onClick"
            @contextmenu="$emit('contextmenu', $event)"
            @mousemove="onMouseMove"
            @dragstart="onDragStart"
            @mouseup="onMouseUp"
            draggable
        >
        </div>
        <div
            :style="{
                '--offsetX': offset.x,
                '--offsetY': offset.y,
                '--scale': scale,
            }"
            class="scene__content"
        >
            <slot></slot>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            dragStartPosition: null,
            dragStartOffset: null,
            offset: {
                x: 0,
                y: 0,
            },
            scale: 1,
        };
    },
    methods: {
        /**
         * @param {MouseEvent} event
         */
        eventRelativePosition(event) {
            const {clientX, clientY}  = event;
            const {left, top} = this.$el.getBoundingClientRect()
            return {
                x: clientX - left,
                y: clientY - top,
            };
        },
        onClick(event) {
            this.$emit('click', event);
        },
        onMouseWheel(event) {
            const {x, y} = this.eventRelativePosition(event);
            const oldVal = this.scale;
            const newVal = Math.max(0.2, this.scale + Math.sign(event.wheelDelta) * 0.08);
            this.scale = newVal;

            const compensate = {
                x: (x / newVal) - (x / oldVal),
                y: (y / newVal) - (y / oldVal),
            }

            this.offset = {
                x: this.offset.x + compensate.x,
                y: this.offset.y + compensate.y,
            }
        },
        onMouseMove(event) {
            // console.log(event);
            if (this.dragStartPosition) {
                const {x, y} = this.eventRelativePosition(event);
                const dragDiff = {
                    x: this.dragStartOffset.x + (x - this.dragStartPosition.x) / this.scale,
                    y: this.dragStartOffset.y + (y - this.dragStartPosition.y) / this.scale,
                }
                this.offset = dragDiff;
            }

        },
        onDragStart(event) {
            event.preventDefault();

            // save current offset
            this.dragStartOffset = {
                x: this.offset.x,
                y: this.offset.y,
            }
            // save start of dragging
            this.dragStartPosition = this.eventRelativePosition(event);
        },
        onMouseUp(event) {
            this.dragStartOffset = null;
            this.dragStartPosition = null;
        }
    }
}
</script>
<style>
.scene {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.scene__backdrop {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}
.scene__content {
    --offsetXPx: calc(var(--offsetX) * 1px);
    --offsetYPx: calc(var(--offsetY) * 1px);
    position: relative;
    transform-origin: left top;
    transform:
      scale(var(--scale))
      translate(var(--offsetXPx), var(--offsetYPx))
    ;
}
</style>
