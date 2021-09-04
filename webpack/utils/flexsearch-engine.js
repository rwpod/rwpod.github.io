import {Index} from 'flexsearch'
import latinCharset from 'flexsearch/dist/module/lang/latin/default'
import cyrillicCharset from 'flexsearch/dist/module/lang/cyrillic/default'
import enLang from 'flexsearch/dist/module/lang/en'

const INDEX_OPTIONS = {
  cache: 100,
  depth: 1,
  tokenize: 'strict',
  context: true,
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
