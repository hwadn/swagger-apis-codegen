import Handlebars from 'handlebars'
import apisTemplate from '@/templates/apis.hbs'
import modelsTemplate from '@/templates/models.hbs'
import properties from '@/templates/partials/properties.hbs'
import { ITagApis } from '@/interfaces/apis'
import { ISchemas } from '@/interfaces/models'
import { IFormattedTypeDescription } from '@/interfaces/partial'
import { OpenAPIV3 } from 'openapi-types/dist/index'
import { swaggerPathToJs } from '@/utils/format'

export const apisRender = Handlebars.template<ITagApis>(apisTemplate)
export const modelsRender = Handlebars.template<ISchemas>(modelsTemplate)

// helpers
Handlebars.registerHelper('firstLowCase', (value: string) => value.replace(/^[A-Z]/, firstCh => firstCh.toLocaleLowerCase()))
Handlebars.registerHelper('parsePath', (path: string, parameters: OpenAPIV3.PathItemObject['parameters']) => {
  const pathParameters =  parameters?.filter(parameter => ('in' in parameter) && parameter.in === 'path')
  return swaggerPathToJs(path, !!pathParameters && pathParameters?.length > 0)
})

// partials
Handlebars.registerPartial('typeValues', Handlebars.template<IFormattedTypeDescription>(properties))
