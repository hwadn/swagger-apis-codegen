import Handlebars from 'handlebars'
import apisTemplate from '@/templates/apis.hbs'
import modelsTemplate from '@/templates/models.hbs'
import propertiesTemplate from '@/templates/partials/properties.hbs'
import apiArgsTemplate from '@/templates/partials/apiArgs.hbs'
import { ITagApis, IApiInfo } from '@/interfaces/apis'
import { ISchemas } from '@/interfaces/models'
import { IFormattedTypeDescription } from '@/interfaces/partial'

import { OpenAPIV3 } from 'openapi-types/dist/index'
import { swaggerPathToJs } from '@/utils/format'
import { parseRefs } from '@/utils/parse'

export const apisRender = Handlebars.template<ITagApis>(apisTemplate)
export const modelsRender = Handlebars.template<ISchemas>(modelsTemplate)

// partials
Handlebars.registerPartial(
  'typeValues',
  Handlebars.template<IFormattedTypeDescription>(propertiesTemplate)
)
Handlebars.registerPartial(
  'apiArgs',
  Handlebars.template<IFormattedTypeDescription>(apiArgsTemplate)
)

// helpers
// apis
Handlebars.registerHelper('firstLowCase', (value: string) =>
  value.replace(/^[A-Z]/, (firstCh) => firstCh.toLocaleLowerCase())
)
Handlebars.registerHelper(
  'parsePath',
  (path: string, parameters: OpenAPIV3.PathItemObject['parameters']) => {
    const pathParameters = parameters?.filter(
      (parameter) => 'in' in parameter && parameter.in === 'path'
    )
    return swaggerPathToJs(path, !!pathParameters && pathParameters?.length > 0)
  }
)
Handlebars.registerHelper('parseArgs', function (this: IApiInfo) {
  const { parameters, requestBody } = this
  const pathParams = parameters?.filter(
    (param) => 'in' in param && param.in === 'path'
  )
  const paramsString = Handlebars.compile('{{> apiArgs}}')({ pathParams })
  if (requestBody && 'content' in requestBody) {
    const mediaSchema = requestBody.content['application/json'].schema
    if (mediaSchema && '$ref' in mediaSchema) {
      const ref = mediaSchema['$ref']
      const refType = parseRefs(ref)
      return paramsString + ';' + `body: types.${refType}`
    }
  }
  return paramsString
})
// models
Handlebars.registerHelper(
  'parseProperties',
  function (this: IFormattedTypeDescription) {
    if ('$ref' in this && this['$ref'].length > 0) {
      return parseRefs(this['$ref'])
    }

    // TODO allOf, anyOf
    if ('oneOf' in this) {
      const refs = this.oneOf?.map(
        (refObj) => '$ref' in refObj && parseRefs(refObj['$ref'])
      )
      return refs?.join(' | ')
    }
    if ('type' in this) {
      switch (this.type) {
        case 'integer':
          return 'number'
        case 'array': {
          const items = this.items
          if ('$ref' in items && items['$ref'].length > 0) {
            return parseRefs(items['$ref']) + '[]'
          }
          return Handlebars.compile('{{parseProperties}}')(items) + '[]'
        }
        case 'object':
          if (this.properties.length === 0) {
            // TODO fix
            return new Handlebars.SafeString('Record<string, unknown>')
          }
          // TODO fix
          return '{' + Handlebars.compile('{{> typeValues}}')(this) + '}'
        default:
          return this.type
      }
    }
  }
)
