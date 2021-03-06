<template>
  <Accordion :opened="opened" sub="true" @close="close" @toggle="toggle">
    <template #title>
      <h6>
        {{ activite.date | dateFormat }} |
        <span class="cap-first"
          ><span v-if="activite.periode && activite.periode.nom"
            >{{ activite.periode.nom }}
          </span>
          {{ activite.annee }}</span
        >
      </h6>
      <h3 class="mb-s">
        <span class="cap-first">{{ activite.type.nom }}</span>
      </h3>
      <Statut
        :color="activite.statut.couleur"
        :nom="activite.statut.nom"
        class="mb-xs"
      />
    </template>
    <template #buttons>
      <button
        v-if="activite.suppression"
        class="cmn-activite-btn-supprimer btn py-s px-m h5 flex mr-px"
        title="supprimer l'activité'"
        @click="activiteRemovePopupOpen"
      >
        <i class="icon-24 icon-trash" />
      </button>
      <ActiviteButton
        v-if="activite.modification"
        :activite="activite"
        :context="context"
      />
    </template>

    <div>
      <div v-if="activite.dateSaisie" class="border-b-s px-m pt-m">
        <h6>
          Date de {{ activite.statut.id === 'dep' ? 'dépôt' : 'modification' }}
        </h6>
        <p>{{ activite.dateSaisie | dateFormat }}</p>
      </div>

      <Section
        v-for="s in activite.sections"
        :key="s.id"
        class="border-b-s px-m pt-m"
        :section="s"
        :contenu="activite.contenu ? activite.contenu[s.id] : {}"
        :date="activite.date"
      />

      <Documents
        v-if="activite.documents && activite.documents.length"
        :bouton-suppression="activite.modification"
        :bouton-modification="activite.modification"
        :context="context"
        :documents="activite.documents"
        :etiquette="activite.modification"
        :parent-id="activite.id"
        :parent-type-id="activite.type.id"
        :title="documentPopupTitle"
        repertoire="activites"
        class="px-m"
      />
    </div>
  </Accordion>
</template>

<script>
import ActiviteButton from './button.vue'
import Accordion from '../_ui/accordion.vue'
import Section from '../_common/section.vue'
import Statut from '../_common/statut.vue'

import Documents from '../documents/list.vue'
import RemovePopup from './remove-popup.vue'

export default {
  components: {
    ActiviteButton,
    Accordion,
    Section,
    Statut,
    Documents
  },

  props: {
    activite: { type: Object, required: true },
    context: { type: Object, required: true }
  },

  computed: {
    documentNew() {
      return {
        titreActiviteId: this.activite.id,
        entreprisesLecture: false,
        publicLecture: false,
        fichier: null,
        fichierNouveau: null,
        fichierTypeId: null,
        typeId: ''
      }
    },

    documentPopupTitle() {
      return `${this.activite.type.nom} | ${this.activite.periode.nom} ${this.activite.annee}`
    },

    opened() {
      if (this.context.name === 'titre') {
        return this.$store.state.titre.opened.activites[this.activite.id]
      }

      return this.$store.state.titreActivite.opened
    }
  },

  methods: {
    close() {
      if (this.context.name === 'titre') {
        this.$store.commit('titre/close', {
          section: 'activites',
          id: this.activite.id
        })
      } else {
        this.$store.commit('titreActivite/close')
      }
    },

    toggle() {
      if (this.context.name === 'titre') {
        this.$store.commit('titre/toggle', {
          section: 'activites',
          id: this.activite.id
        })
      } else {
        this.$store.commit('titreActivite/toggle')
      }
    },

    activiteRemovePopupOpen() {
      this.$store.commit('popupOpen', {
        component: RemovePopup,
        props: {
          activiteId: this.activite.id,
          typeNom: this.activite.type.nom,
          annee: this.activite.annee,
          periodeNom: this.activite.periode.nom,
          context: this.context
        }
      })
    }
  }
}
</script>
