<template>
    <div
        v-if="open"
        class="context-menu"
        :style="{
            '--left': `${currentPosition.x}px`,
            '--top': `${currentPosition.y}px`,
        }"
    >
        <div>
            <input
                ref="search"
                placeholder="Type to filter"
                class="context-menu__search"
                v-model="search"
                type="search"
            >
        </div>
        <ul class="context-menu__list">
            <li
                v-for="item in currentItems"
                :key="item.label"
                class="context-menu__item"
                @click="select(item)"
            >
                {{ item.label }}
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        position: {
            type: null,
            required: true,
        },
        open: {
            type: Boolean,
            default: false,
        },
        items: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            search: '',
        };
    },
    watch: {
        async open(isOpen) {
            if (isOpen) {
                await this.$nextTick();
                this.$refs.search.focus();
            } else {
                this.search = '';
            }
        }
    },
    computed: {
        searchRegex() {
            return new RegExp(this.search.split('').join('.*'), 'i');
        },
        currentItems() {
            return this.items.filter(({label}) => this.searchRegex.test(label))
        },
        currentPosition() {
            return Object.assign({x: 0, y: 0}, this.position);
        },
    },
    methods: {
        select(item) {
            this.$emit('selected', {
                x: this.currentPosition.x,
                y: this.currentPosition.y,
                item,
            });
        }
    },
}
</script>
<style>
.context-menu {
    --left: 0;
    --top: 0;
    position: absolute;
    left: var(--left);
    top: var(--top);
    background: rgba(255,255,255, 0.9);
    padding: 0;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 1px 2px 2px rgba(0,0,0, 0.4)
}

.context-menu__list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 250px;
    overflow-y: auto;
    overflow-x: hidden;
}

.context-menu__item ~ .context-menu__item {
     border-top: 1px solid rgba(0,0,0,0.1);
}

.context-menu__item {
    padding: 4px 6px;
    cursor: pointer;
}

.context-menu__item:hover {
    color: white;
    background:
        linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.2))
        var(--primary-color);
}

.context-menu__search {
    padding: 4px 6px;
    border: none;
}
</style>
