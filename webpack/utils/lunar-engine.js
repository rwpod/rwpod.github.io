import lunr from 'lunr'
import lunrStemmer from 'lunr-languages/lunr.stemmer.support'
import lunrRu from 'lunr-languages/lunr.ru'
import lunrMulti from 'lunr-languages/lunr.multi'

lunrStemmer(lunr)
lunrRu(lunr)
lunrMulti(lunr)

export default lunr
