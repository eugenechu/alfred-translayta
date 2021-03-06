const alfy = require('alfy')

const { config } = require('../config/config.js')
const { createArgWithParams } = require('../utils.js')
const { Cache } = require('./cache.js')

class FavoritesCache extends Cache {
  get items() {
    return super.get()
  }

  get keys() {
    return Object.keys(this.items).reverse()
  }

  _getOutputItem(key, withSubtitle = config.get('withSubtitle')) {
    const word = key
    const translations = this.items[key]

    return {
      title: word,
      subtitle: withSubtitle ? translations : '',
      arg: createArgWithParams('remove or edit', word, translations),
      mods: {
        alt: {
          subtitle: !withSubtitle ? translations : ''
        }
      }
    }
  }

  add(word, translations) {
    const items = this.items

    items[word] = translations
    super.set(items)
  }

  remove(word) {
    const items = this.items

    delete items[word]
    super.set(items)
  }

  clear() {
    super.reset()
  }

  getFavorites() {
    const blockSize = 7
    const keys = this.keys
    const keysCount = keys.length
    const favoritesList = []

    for (let idx = 0; idx < keysCount; idx++) {
      if (idx && !(idx % blockSize)) {
        let lastIndex = idx + blockSize
        if (lastIndex > keysCount) {
          lastIndex = keysCount
        }

        const subtitle = `${idx + 1}—${lastIndex} ⤵️`
        favoritesList.push({ title: ' ', subtitle, icon: { path: ' ' } })
      }

      const key = keys[idx]
      const outputItem = this._getOutputItem(key)
      favoritesList.push(outputItem)
    }

    return favoritesList
  }

  filterBy(userInput) {
    const keys = this.keys
    const matches = keys.filter(key => key.includes(userInput))

    return matches.map(key => this._getOutputItem(key))
  }
}

exports.favoritesCache = new FavoritesCache('favorites', alfy.cache)
