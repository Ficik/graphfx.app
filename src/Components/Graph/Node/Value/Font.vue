<template>
  <label
    class="font-input"
  >
    <input
        class="font-input__input"
        type="file"
        accept="font/otf,font/sfnt,font/ttf,font-woff,font/woff2"
        @input="onChange"
    >
    upload
  </label>
</template>
<script>
import uuidv4 from 'uuid/v4';

const loadBlobAsDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onloadend = () => {
    resolve(reader.result);
  };
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});

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
        /**
         * @param {InputEvent} $event
         */
        async onChange($event) {
          const file = $event.target.files[0];
          if (file) {
            const dataUrl = await loadBlobAsDataUrl(file);
            const name = uuidv4();
            const url = `url(${dataUrl})`;
            this.io.value = {
              name,
              url,
              fontface: new FontFace(name, url),
            };
          }
        }
    }
}
</script>
<style>
.font-input {
  background-color: rgba(0,0,0,0.8);
  border: 1px solid black;
  color: white;
  padding: 2px 4px;
  border-radius: 5px;
  text-align: center;
}

.font-input__input {
  display: none;
}

</style>
