<template>
  <button @click="addPopupOpen">
    <i class="icon-24 icon-file-link" />
  </button>
</template>

<script>
import JustificatifsEditPopup from './edit-popup.vue'

export default {
  props: {
    id: { type: String, required: true },
    context: { type: Object, required: true },
    title: { type: String, default: '' },
    documents: { type: Object, required: true }
  },

  methods: {
    addPopupOpen() {
      this.$store.commit('popupOpen', {
        component: JustificatifsEditPopup,
        props: {
          id: this.id,
          context: this.context,
          documents: this.documents,
          title: this.title
        }
      })
    }
  }
}
</script>
