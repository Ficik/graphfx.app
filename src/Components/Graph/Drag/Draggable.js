import interact from 'interactjs';

export default {
  abstract: true,
  props: {
    handle: {
      type: String,
      default: undefined,
    },
  },
  render() {
    try {
      return this.$slots.default[0];
    } catch (e) {
      throw new Error('Exactly one child component needed.');
    }
    return null;
  },
  mounted () {
    const el = this.$slots.default[0].elm;
    this.$nextTick(() => {
      interact(el)
      .draggable({
        allowFrom: this.handle,
        onmove: (event) => {
          this.$emit('move', event);
        }
      })
    })
  }
}