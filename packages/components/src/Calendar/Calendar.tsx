import React, { FC } from 'react'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'
// Include the locale utils designed for moment
import MomentLocaleUtils from 'react-day-picker/moment'

// Make sure moment.js has the required locale data
import 'moment/locale/ar'
import 'moment/locale/de'
import 'moment/locale/es'
import 'moment/locale/fr'
import 'moment/locale/it'
import 'moment/locale/ja'
import 'moment/locale/ko'
import 'moment/locale/nl'
import 'moment/locale/pl'
import 'moment/locale/pt'
import 'moment/locale/pt-br'
import 'moment/locale/ru'
import 'moment/locale/sv'
import 'moment/locale/tr'
import 'moment/locale/zh-cn'
import 'moment/locale/zh-tw'

// TODO: Figure out a more global place to keep this
enum LocaleCodes {
  Ar = 'ar', // Arabic
  De = 'de', // Germany
  En = 'en', // English
  Es = 'es', // Spanish
  Fr = 'fr', // French
  It = 'it', // Italian
  Ja = 'ja', // Japanese
  Ko = 'ko', // Korean
  Nl = 'nl', // Dutch
  Pl = 'pl', // Polish
  Pt = 'pt', // Portuguese - Portugal
  PtBr = 'pt-br', // Portuguese - Brazil
  Ru = 'ru', // Russian
  Sv = 'sv', // Swedish
  Tr = 'tr', // Turkish
  ZhCn = 'zh-cn', // Chinese - China (Simplified)
  ZhTw = 'zh-tw', // Chinese - Taiwan
}

interface CalendarProps {
  locale?: LocaleCodes
}

export const Calendar: FC<CalendarProps> = ({ locale = LocaleCodes.En }) => {
  return (
    <DayPicker
      localeUtils={MomentLocaleUtils}
      locale={locale}
      showOutsideDays={true}
    />
  )
}
