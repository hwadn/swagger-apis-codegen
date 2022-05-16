import Handlebars from 'handlebars'
import apisTemplate from '@/templates/apis.hbs'
import { ITagApis } from '@/interfaces/apis'
import { OpenAPIV3 } from 'openapi-types/dist/index'
import { swaggerPathToJs } from '@/utils/transform'

export const apisRender = Handlebars.template<ITagApis>(apisTemplate)

// helpers
Handlebars.registerHelper('firstLowCase', (value: string) => value.replace(/^[A-Z]/, firstCh => firstCh.toLocaleLowerCase()))
Handlebars.registerHelper('parsePath', (path: string, parameters: OpenAPIV3.PathItemObject['parameters']) => {
  const pathParameters =  parameters?.filter(parameter => ('in' in parameter) && parameter.in === 'path')
  return swaggerPathToJs(path, !!pathParameters && pathParameters?.length > 0)
})
