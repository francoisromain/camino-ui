<template>
  <div>
    <ul class="list-sans mb-l">
      <li
        v-for="definition in definitions"
        id="=="
        :key="definition.id"
        :class="{ active: slug === definition.slug }"
      >
        <RouterLink
          :to="{ name: 'definition', params: { slug: definition.slug } }"
          class="btn-menu text-decoration-none bold"
        >
          {{ definition.nom }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sommaire',

  props: {
    definitions: { type: Array, default: () => [] },
    slug: { type: String, default: () => null }
  }
}
</script>
