import Vue from 'vue'

import { titresMetas, titresGeo, titres, titresGeoPolygon } from '../api/titres'
import { paramsBuild } from '../utils/'

export const state = {
  list: [],
  total: 0,
  vue: 'carte',
  metas: {
    domaines: [],
    types: [],
    statuts: []
  },
  params: [
    { id: 'typesIds', type: 'strings', elements: [] },
    { id: 'domainesIds', type: 'strings', elements: [] },
    { id: 'statutsIds', type: 'strings', elements: [] },
    { id: 'substances', type: 'string' },
    { id: 'noms', type: 'string' },
    { id: 'entreprises', type: 'string' },
    { id: 'references', type: 'string' },
    { id: 'territoires', type: 'string' },
    { id: 'page', type: 'number', value: 1, min: 0 },
    { id: 'intervalle', type: 'number', min: 10, max: 500 },
    {
      id: 'colonne',
      type: 'string',
      elements: [
        'nom',
        'domaine',
        'type',
        'statut',
        'activitesTotal',
        'substances',
        'titulaires',
        'references'
      ]
    },
    {
      id: 'ordre',
      type: 'string',
      elements: ['asc', 'desc']
    },
    { id: 'perimetre', type: 'numbers' }
  ],
  preferences: {
    table: { page: 1, intervalle: 200, ordre: 'asc', colonne: 'nom' },
    carte: { perimetre: [0, 0, 0, 0], zoom: null, centre: [] },
    filtres: {
      typesIds: [],
      domainesIds: [],
      statutsIds: [],
      noms: '',
      entreprises: '',
      substances: '',
      references: '',
      territoires: ''
    }
  },
  loaded: {
    metas: false,
    vue: false,
    filtres: false,
    component: false,
    urls: false
  }
}

export const actions = {
  async metasGet({ state, commit, dispatch }) {
    commit('loadingAdd', 'titresMetasGet', { root: true })

    try {
      const data = await titresMetas()

      commit('metasSet', data)

      if (!state.loaded.metas) {
        commit('loaded', 'metas')
      }
    } catch (e) {
      dispatch('apiError', e, { root: true })
    } finally {
      commit('loadingRemove', 'titresMetasGet', { root: true })
    }
  },

  async get({ state, dispatch, commit }) {
    try {
      if (!state.loaded.metas || !state.loaded.urls) return

      commit('loadingAdd', 'titres', { root: true })

      let data

      if (state.vue === 'carte') {
        const params = paramsBuild(
          state.params,
          Object.assign({}, state.preferences.filtres, state.preferences.carte)
        )

        if (state.preferences.carte.zoom > 7) {
          data = await titresGeoPolygon(params)
        } else {
          data = await titresGeo(params)
        }
      } else {
        const params = paramsBuild(
          state.params,
          Object.assign({}, state.preferences.filtres, state.preferences.table)
        )
        data = await titres(params)
      }

      commit('set', Object.freeze(data))
    } catch (e) {
      dispatch('apiError', e, { root: true })
      console.info(e)
    } finally {
      commit('loadingRemove', 'titres', { root: true })
    }
  },

  async preferencesSet({ state, commit, dispatch }, { section, params }) {
    const paramsNew = Object.keys(params).reduce((acc, id) => {
      if (state.preferences[section][id] !== params[id]) {
        acc[id] = params[id]
      }

      return acc
    }, {})

    if (Object.keys(paramsNew).length) {
      commit('preferencesSet', { section, params: paramsNew })

      if (
        section === 'carte' &&
        !Object.keys(paramsNew).includes('perimetre')
      ) {
        return
      }

      await dispatch('get')
    }
  },

  async vueSet({ state, commit, dispatch }, vue) {
    if (vue === state.vue) return

    commit('set', { elements: [], total: 0 })
    commit('vueSet', vue)

    // si la vue est 'carte'
    // le composant `map.vue` émet un event `perimetre`
    // qui met à jour les préférences utilisateurs
    // et déclenche déjà un rechargement des titres
    if (vue === 'carte') return

    await dispatch('get')
  },

  async loaded({ commit, state, dispatch }, id) {
    commit('loaded', id)

    if (
      state.loaded.vue &&
      state.loaded.component &&
      state.loaded.filtres &&
      !state.loaded.urls
    ) {
      state.loaded.urls = true

      await dispatch('get')
    }
  }
}

export const mutations = {
  reset(state) {
    Vue.set(state, 'list', [])
    state.total = 0
    state.loaded.metas = false
    state.loaded.vue = false
    state.loaded.filtres = false
    state.loaded.component = false
    state.loaded.urls = false
  },

  set(state, data) {
    Vue.set(state, 'list', data.elements)
    Vue.set(state, 'total', data.total)
  },

  metasSet(state, data) {
    Object.keys(data).forEach(id => {
      let paramsIds
      let metaId
      if (id === 'types') {
        metaId = id
        paramsIds = ['typesIds']
      } else if (id === 'domaines') {
        metaId = id
        paramsIds = ['domainesIds']
      } else if (id === 'statuts') {
        metaId = id
        paramsIds = ['statutsIds']
      }

      if (metaId) {
        Vue.set(state.metas, id, data[id])
      }

      if (paramsIds) {
        paramsIds.forEach(paramId => {
          const param = state.params.find(p => p.id === paramId)
          Vue.set(
            param,
            'elements',
            data[id].map(e => e.id)
          )
        })
      }
    })
  },

  preferencesSet(state, { section, params }) {
    Object.keys(params).forEach(id => {
      Vue.set(state.preferences[section], id, params[id])
    })
  },

  vueSet(state, vue) {
    Vue.set(state, 'vue', vue)
  },

  loaded(state, section) {
    state.loaded[section] = true
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
