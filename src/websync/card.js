import store from '@/store/index.js'
import { CHANGE_CARD, DELETE_CARD } from '@/store/actions/cards'
import { computed } from 'vue'
import * as CARD from '@/store/actions/cards'

const selectedCard = computed(() => store.state.cards.selectedCard)
export function createCard (obj) {
  store.commit(CHANGE_CARD, obj.obj)
}

export function removeCard (uid) {
  if (selectedCard.value && uid === selectedCard.value?.uid) {
    selectedCard.value = ''
    store.dispatch('asidePropertiesToggle', false)
    store.commit(CARD.SELECT_CARD, false)
  }
  store.commit(DELETE_CARD, uid)
}

export function updateCard (obj) {
  store.commit(CHANGE_CARD, obj.obj)
}
