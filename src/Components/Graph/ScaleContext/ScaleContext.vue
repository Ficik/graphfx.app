<template>
    <div
        class="scene"
    >
        <div
            class="scene__backdrop"
            @wheel="onMouseWheel"
            @mousemove="onMouseMove"
            @dragstart="onDragStart"
            @mouseup="onMouseUp"
            @mousedown="onMouseDown"
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
            dataOffset: {
                x: 0,
                y: 0,
            },
            dataScale: 1,
            mouseDown: false,
        };
    },
    computed: {
        scale: {
            set(val) {
                this.dataScale = val;
                this.updateTransform();
            },
            get() {
                return this.dataScale;
            },
        },
        offset: {
            set(val) {
                this.dataOffset = val;
                this.updateTransform();
            },
            get() {
                return this.dataOffset;
            }
        },
    },
    mounted() {
        this.updateTransform();
    },
    methods: {
        updateTransform() {
            this.$emit('update:transform', (event) => {
                if (!event) {
                    return event;
                }
                if (event.clientX !== undefined && event.clientY !== undefined) {
                    const {trueX, trueY} = this.eventRelativePosition(event);
                    return {x: trueX, y: trueY};
                } else {
                    const {left, top} = this.$el.getBoundingClientRect()
                    return {
                        left: ((event.left - left) / this.scale) - this.offset.x,
                        right: ((event.right - left) / this.scale) - this.offset.x,
                        top: ((event.top - top) / this.scale) - this.offset.y,
                        bottom: ((event.bottom - top) / this.scale) - this.offset.y,
                        width:  event.width / this.scale,
                        height: event.height / this.scale,
                    }
                }
            });
        },
        /**
         * @param {MouseEvent} event
         */
        eventRelativePosition(event) {
            const {clientX, clientY}  = event;
            const {left, top} = this.$el.getBoundingClientRect()
            return {
                x: clientX - left,
                y: clientY - top,
                trueX: ((clientX - left) / this.scale) - this.offset.x,
                trueY: ((clientY - top) / this.scale) - this.offset.y,
            };
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
        onMouseDown(event) {
            this.mouseDown = true;
        },
        onMouseUp(event) {
            if (this.dragStartOffset) {
                this.dragStartOffset = null;
                this.dragStartPosition = null;
            } else if (this.mouseDown) {
                this.emitClick(event);
            }
            this.mouseDown = false;
        },
        emitClick(event) {
            const {trueX, trueY} = this.eventRelativePosition(event);
            this.$emit('click', {
                x: trueX,
                y: trueY,
            });
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
    cursor: grab;
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
