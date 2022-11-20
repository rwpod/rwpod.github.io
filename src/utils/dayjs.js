import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import updateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(updateLocale)

export default dayjs
