import FlexSearch from 'flexsearch'

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

export const latinIndex = new FlexSearch.Index({
  ...INDEX_OPTIONS,
  charset: FlexSearch.Charset.LatinAdvanced,
  lang: 'en'
})

export const cyrillicIndex = new FlexSearch.Index({
  ...INDEX_OPTIONS,
  charset: FlexSearch.Charset.CyrillicDefault
})
