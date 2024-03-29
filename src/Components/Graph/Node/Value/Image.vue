<template>
    <div
        class="image-value"
        @click="onClick"
        @mouseenter="isPreviewVisible = true"
        @mouseleave="isPreviewVisible = false"
    >
        <canvas class="image-value__thumb" ref="thumb" />
        <canvas class="image-value__preview" ref="preview" />
    </div>
</template>
<script>
import {paintToCanvas, mediaSize} from 'graphfx/src/nodes/canvas'
import _ from 'lodash';

export default {
    props: {
        io: {
            type: null,
            required: true,
        },
        value: {
            type: null,
            required: true,
        },
        direction: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            isRunning: true,
            isPreviewVisible: false,
            redrawThumb: _.throttle(() => this.redrawCanvas(this.$refs.thumb), 500, {leading: true, trailing: true}),
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.redraw();
            this.io.onchange(this.onChange);
        })
    },
    watch: {
        isPreviewVisible(isVisible) {
            if (isVisible) {
                this.redraw();
            }
        },
        isRunning: {
            handler() {
                this.redraw();
            }
        }
    },
    beforeDestroy() {
        this.isRunning = false;
        if (this.io) {
            this.io.offchange(this.onChange)
        }
    },
    methods: {
        onChange() {
            this.redraw();
        },
        redrawCanvas(canvas) {
            const value = this.io.value;
            if (!canvas) return;
            /** @type {HTMLCanvasElement} */
            const ctx = canvas.getContext('2d');
            if (!value) {
                canvas.width = 1;
                canvas.height = 1;
                ctx.clearRect(0, 0, 1, 1);
            } else {
                const {width, height} = mediaSize(value);
                canvas.width = width;
                canvas.height = height;
                paintToCanvas(canvas, value, {
                    top: 0,
                    left: 0,
                    width, height,
                });
            }
        },
        redraw() {
            if (this.isRunning) {
                if (this.$store.isPreviewEnabled) {
                    this.redrawThumb();
                }
                // this.redrawCanvas(this.$refs.thumb);
                if (this.isPreviewVisible) {
                    this.redrawCanvas(this.$refs.preview)
                }
            }
        },
        onClick() {
            if (this.direction === 'output') {
                this.download();
            } else {
                this.selectFile();
            }
        },
        selectFile() {
            const input = document.createElement('input');
            window.$$input = input;
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (event) => {
                const files = event.target.files;
                if (files.length) {
                    const fr = new FileReader()
                    fr.onload = (event) => {
                        const image = new Image();
                        image.onload = () => {
                            this.$emit('change', image);
                            this.onChange();
                        }
                        image.src = event.target.result;
                    }
                    fr.readAsDataURL(files[0]);
                }
            }
            input.click();
        },
        download() {
            const a = document.createElement('a');
            this.$refs.preview.toBlob((blob) => {
                a.href = URL.createObjectURL(blob);
                a.download = 'sample.png';
                a.click();
            });
        }
    }
}
</script>
<style>
.image-value {
    position: relative;
    text-align: center;
}
.image-value__thumb, .image-value__preview {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJ0lEQVQoU2NsaGj4z4AG6uvr0YUYGIeCwv///2N4prGxEdMzQ0AhAChTL3KV95+lAAAAAElFTkSuQmCC);
    background-repeat: repeat;
}

.image-value__thumb {
    width: 50px;
    height: 50px;
    object-fit: contain;
    border: 2px solid black;
}

.image-value__preview {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 30vw;
    height: 30vh;
    object-fit: contain;
    background-color: black;
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 120ms;
}

.image-value__thumb:hover ~ .image-value__preview {
    opacity: 1;
}
</style>
