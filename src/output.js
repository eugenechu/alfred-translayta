const { intl } = require('./intl')

module.exports.formatMainTranslation = (translation, targetLang) => ({
  title: translation,
  subtitle: intl.bestTranslMsg[targetLang]
})

module.exports.formatOtherTranslations = (otherTranslations = {}) =>
  Object.keys(otherTranslations).reduce((acc, partOfSpeech) => {
    const translations = otherTranslations[partOfSpeech]
    const items = translations.map((item, idx) => ({
      title: item,
      subtitle: idx === 0 ? `${partOfSpeech} ⤵️` : ''
    }))

    return [...acc, ...items]
  }, [])

module.exports.formatAutoCorrection = (correctedValue, targetLang) => {
  const parsedValue = correctedValue.replace(/[\[\]]/g, '')

  return {
    title: parsedValue,
    subtitle: intl.autoCorrectMsg[targetLang],
    autocomplete: parsedValue,
    icon: {
      path: './icons/question.png'
    }
  }
}