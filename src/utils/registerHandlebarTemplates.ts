import Handlebars from 'handlebars'
import apisTemplate from '@/templates/apis.hbs'
import modelsTemplate from '@/templates/models.hbs'
import propertiesTemplate from '@/templates/partials/properties.hbs'
import { ITagApis } from '@/interfaces/apis'
import { ISchemas } from '@/interfaces/models'
import { IFormattedTypeDescription } from '@/interfaces/partial'
import { OpenAPIV3 } from 'openapi-types/dist/index'
import { swaggerPathToJs } from '@/utils/format'

export const apisRender = Handlebars.template<ITagApis>(apisTemplate)
export const modelsRender = Handlebars.template<ISchemas>(modelsTemplate)

// partials
Handlebars.registerPartial('typeValues', Handlebars.template<IFormattedTypeDescription>(propertiesTemplate))

// helpers
Handlebars.registerHelper('firstLowCase', (value: string) => value.replace(/^[A-Z]/, firstCh => firstCh.toLocaleLowerCase()))
Handlebars.registerHelper('parsePath', (path: string, parameters: OpenAPIV3.PathItemObject['parameters']) => {
  const pathParameters =  parameters?.filter(parameter => ('in' in parameter) && parameter.in === 'path')
  return swaggerPathToJs(path, !!pathParameters && pathParameters?.length > 0)
})

const parseRefs = (res: string) => {
  const refPaths = res.split('/')
  return `I${refPaths[refPaths.length - 1]}`
}

Handlebars.registerHelper('parseProperties', function(this: IFormattedTypeDescription) {
  if ('$ref' in this && this['$ref'].length > 0) {
    return parseRefs(this['$ref'])
  }

  // TODO allOf, anyOf
  if ('oneOf' in this) {
    const refs = this.oneOf?.map(refObj => ('$ref' in refObj && parseRefs(refObj['$ref'])))
    return refs?.join(' | ')
  }
  if ('type' in this) {
    switch (this.type) {
      case 'integer':
        return 'number'
      case 'array': // TODO fix
        const items = this.items
        if ('$ref' in items && items['$ref'].length > 0) {
          return parseRefs(items['$ref']) + '[]'
        }
        return Handlebars.compile('{{parseProperties}}')(items) + '[]'
      case 'object': // TODO fix
        return '{' + Handlebars.compile('{{> typeValues}}')(this) + '}'
      default:
        return this.type
    }
  }
})
