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
import { parseRefs, extractParameters } from '@/utils/parse'

export const apisRender = Handlebars.template<ITagApis>(apisTemplate)
export const modelsRender = Handlebars.template<ISchemas>(modelsTemplate)

// partials
Handlebars.registerPartial(
  'typeValues',
  Handlebars.template(propertiesTemplate)
)
Handlebars.registerPartial('apiArgs', Handlebars.template(apiArgsTemplate))

// helpers
// apis
Handlebars.registerHelper('firstLowCase', (value: string) =>
  value.replace(/^[A-Z]/, (firstCh) => firstCh.toLocaleLowerCase())
)
Handlebars.registerHelper(
  'parsePath',
  (path: string, parameters: OpenAPIV3.PathItemObject['parameters']) => {
    const pathParameters = extractParameters(parameters)
    return swaggerPathToJs(path, !!pathParameters && pathParameters?.length > 0)
  }
)
Handlebars.registerHelper('parseArgs', function (this: IApiInfo) {
  const { parameters, requestBody, hasParams } = this
  const pathParams = extractParameters(parameters)
  const paramsString = Handlebars.compile('{{> apiArgs}}')({ pathParams })
  if (requestBody && 'content' in requestBody) {
    const mediaSchema = requestBody.content['application/json'].schema
    if (mediaSchema && '$ref' in mediaSchema) {
      const ref = mediaSchema['$ref']
      const refType = parseRefs(ref)
      if (hasParams) {
        return paramsString + ';' + `body: types.${refType}`
      } else {
        return `body: types.${refType}`
      }
    }
  }
  return paramsString
})
Handlebars.registerHelper('parseResponse', function (this: IApiInfo) {
  const { responses } = this
  const responseInfo = Object.values(responses)[0]
  if ('content' in responseInfo) {
    const media = responseInfo.content
    if (media && 'application/json' in media) {
      const mediaSchema = media['application/json'].schema
      if (mediaSchema && '$ref' in mediaSchema) {
        const ref = mediaSchema['$ref']
        const refType = parseRefs(ref)
        return `types.${refType}`
      }
    }
  }

  return 'void'
})

Handlebars.registerHelper('parseParams', function (this: IApiInfo) {
  const { parameters, hasParams, hasBody } = this
  const pathParams = extractParameters(parameters)
  let paramKeys
  if (pathParams) {
    paramKeys = pathParams.map((item) => 'name' in item && item.name).join(',')
  }
  if (hasParams) {
    if (hasBody) {
      return `${paramKeys}, body`
    } else {
      return paramKeys
    }
  } else {
    if (hasBody) {
      return 'body'
    } else {
      return ''
    }
  }
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
