import Handlebars from 'handlebars'
import apisTemplate from '@/templates/apis.hbs'
import { ITagApis } from '@/interfaces/apis'

export const apisRender = Handlebars.template<ITagApis>(apisTemplate)

// helpers
Handlebars.registerHelper('firstLowCase', (value: string) => value.replace(/^[A-Z]/, firstCh => firstCh.toLocaleLowerCase()))
