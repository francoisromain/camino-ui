<template>
  <div class="mb">
    <h6>{{ filter.name }}</h6>
    <hr class="mb-s" />

    <input
      v-model="filter.value"
      type="text"
      :placeholder="filter.placeholder"
      class="p-s"
    />
  </div>
</template>

<script>
export default {
  props: {
    filter: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
