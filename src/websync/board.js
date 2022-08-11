import store from '@/store/index.js'
import * as BOARD from '@/store/actions/boards'
import * as CARD from '@/store/actions/cards'

export function updateBoard (obj) {
  const board = obj.obj
  const lastNavStack = store.state.navbar.navStack[store.state.navbar.navStack.length - 1]

  // Обновляем доску в стейте
  store.commit(BOARD.PUSH_BOARD, [board])

  // И если находимся в текущей доске - раскидываем карточки по колонкам
  if (lastNavStack.greedPath === 'boards_children' && lastNavStack.uid === board.uid) {
    const cards = []
    for (let i = 0; i < store.state.cards.cards.length; i++) {
      cards.push(...store.state.cards.cards[i].cards)
    }
    store.commit(CARD.BOARD_CARDS_SUCCESS, {
      boardUid: board.uid,
      rootState: store.state,
      data: {
        cards: cards
      }
    })
  }
}
