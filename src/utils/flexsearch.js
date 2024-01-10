import Index from 'flexsearch/dist/module/index'
import latinCharset from 'flexsearch/dist/module/lang/latin/advanced'
import cyrillicCharset from 'flexsearch/dist/module/lang/cyrillic/default'
import enLang from 'flexsearch/dist/module/lang/en'

const INDEX_OPTIONS = {
  cache: 100,
  tokenize: 'strict',
  context: {
    resolution: 9,
    depth: 2,
    bidirectional: true
  },
  optimize: true
}

export const latinIndex = Index({
  ...INDEX_OPTIONS,
  charset: latinCharset,
  lang: enLang
})

export const cyrillicIndex = Index({
  ...INDEX_OPTIONS,
  charset: cyrillicCharset
})
