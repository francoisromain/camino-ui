<template>
  <div class="px-m pt-m border-b-s">
    <div v-if="etape.duree" class="tablet-blobs">
      <div class="tablet-blob-1-4">
        <h6>Durée</h6>
      </div>
      <div class="tablet-blob-3-4">
        <p>
          <PropDuree :duree="etape.duree" />
          <Tag
            v-if="etape.incertitudes && etape.incertitudes.duree"
            :mini="true"
            color="bg-info"
            class="ml-xs"
          >
            Incertain
          </Tag>
        </p>
      </div>
    </div>

    <div v-if="etape.dateDebut" class="tablet-blobs">
      <div class="tablet-blob-1-4">
        <h6>Date de début</h6>
      </div>
      <div class="tablet-blob-3-4">
        <p>
          {{ etape.dateDebut | dateFormat }}
          <Tag
            v-if="etape.incertitudes && etape.incertitudes.dateDebut"
            :mini="true"
            color="bg-info"
            class="ml-xs"
          >
            Incertain
          </Tag>
        </p>
      </div>
    </div>
    <div v-if="etape.dateFin" class="tablet-blobs">
      <div class="tablet-blob-1-4">
        <h6>Date d'échéance</h6>
      </div>
      <div class="tablet-blob-3-4">
        <p>
          {{ etape.dateFin | dateFormat }}
          <Tag
            v-if="etape.incertitudes && etape.incertitudes.dateFin"
            :mini="true"
            color="bg-info"
            class="ml-xs"
          >
            Incertain
          </Tag>
        </p>
      </div>
    </div>
    <div v-if="etape.points && etape.points.length" class="tablet-blobs">
      <div class="tablet-blob-1-4">
        <h6>Périmètre</h6>
      </div>
      <div class="tablet-blob-3-4">
        <p>
          inclus
          <Tag
            v-if="etape.incertitudes && etape.incertitudes.points"
            :mini="true"
            color="bg-info"
            class="ml-xs"
          >
            Incertain
          </Tag>
        </p>
      </div>
    </div>
    <div v-if="etape.surface" class="tablet-blobs">
      <div class="tablet-blob-1-4">
        <h6>Surface</h6>
      </div>
      <div class="tablet-blob-3-4">
        <p>
          {{ numberFormat(etape.surface) }} km² environ

          <Tag
            v-if="etape.incertitudes && etape.incertitudes.surface"
            :mini="true"
            color="bg-info"
            class="ml-xs"
          >
            Incertain
          </Tag>
        </p>
      </div>
    </div>

    <div
      v-if="etape.titulaires && etape.titulaires.length"
      class="tablet-blobs"
    >
      <div class="tablet-blob-1-4">
        <h6>Titulaire{{ etape.titulaires.length > 1 ? 's' : '' }}</h6>
      </div>
      <div class="tablet-blob-3-4">
        <ul class="list-prefix mb">
          <li v-for="t in etape.titulaires" :key="t.id">
            {{ etablissementNameFind(t.etablissements, etape.date) || t.nom }}
            <Tag
              v-if="etape.incertitudes && etape.incertitudes.titulaires"
              :mini="true"
              color="bg-info"
              class="ml-xs"
            >
              Incertain
            </Tag>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="etape.amodiataires && etape.amodiataires.length"
      class="tablet-blobs"
    >
      <div class="tablet-blob-1-4">
        <h6>Amodiataire{{ etape.amodiataires.length > 1 ? 's' : '' }}</h6>
      </div>
      <div class="tablet-blob-3-4">
        <ul class="list-prefix">
          <li v-for="t in etape.amodiataires" :key="t.id">
            {{ etablissementNameFind(t.etablissements, etape.date) || t.nom }}
            <Tag
              v-if="etape.incertitudes && etape.incertitudes.amodiataires"
              :mini="true"
              color="bg-info"
              class="ml-xs"
            >
              Incertain
            </Tag>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="etape.substances && etape.substances.length"
      class="tablet-blobs"
    >
      <div class="tablet-blob-1-4">
        <h6>Substance{{ etape.substances.length > 1 ? 's' : '' }}</h6>
      </div>
      <div class="tablet-blob-3-4">
        <TagList :elements="etape.substances.map(s => s.nom)" />
        <Tag
          v-if="etape.incertitudes && etape.incertitudes.substances"
          :mini="true"
          color="bg-info"
          class="ml-xs"
        >
          Incertain
        </Tag>
      </div>
    </div>
  </div>
</template>

<script>
import TagList from '../../_ui/tag-list.vue'
import Tag from '../../_ui/tag.vue'
import { etablissementNameFind } from '../../../utils/entreprise'
import PropDuree from './prop-duree.vue'

export default {
  components: {
    TagList,
    Tag,
    PropDuree
  },
  props: {
    etape: { type: Object, default: () => ({}) }
  },
  computed: {
    incertitudesLength() {
      return (
        this.etape.incertitudes &&
        Object.keys(this.etape.incertitudes).reduce((res, i) => {
          if (this.etape.incertitudes[i] && i !== '__typename') {
            res++
          }
          return res
        }, 0)
      )
    }
  },

  methods: {
    etablissementNameFind(etablissements, date) {
      return etablissementNameFind(etablissements, date)
    }
  }
}
</script>
