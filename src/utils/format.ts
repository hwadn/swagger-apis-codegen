import Handlebars from 'handlebars'
import { OpenAPIV3 } from 'openapi-types'
import { IApiInfo, ITagApis } from '@/interfaces/apis'
import { ISchemas } from '@/interfaces/models'
import { IFormattedTypeDescription } from '@/interfaces/partial'

type OpenAPIV3TypeDescription =
  | OpenAPIV3.ReferenceObject
  | OpenAPIV3.SchemaObject

/**
 * Format recursively
 * return value likes:
    {
      key: 'ListAZsResponse',
      properties: [
        { key: 'azs', properties: [], type: 'array', items: [Object] },
        { key: 'total', properties: [], type: 'number' }
      ],
      type: 'object',
      required: [ 'azs', 'total' ]
    }
 */
const formatSchema = (
  objectName: string,
  objectValue: OpenAPIV3TypeDescription
): IFormattedTypeDescription => {
  if ('$ref' in objectValue) {
    return objectValue
  } else {
    const { properties = {}, ...others } = objectValue
    const propertyList = Object.entries(properties).map(
      ([key, description]) => {
        const formattedSchema = formatSchema(key, description)
        return { key, ...formattedSchema }
      }
    )
    return { key: objectName, properties: propertyList, ...others }
  }
}

export const formatSwaggerSchemas = (
  openApiSchemas: OpenAPIV3.ComponentsObject['schemas']
): ISchemas => {
  let schemas: ISchemas['items'] = []
  if (openApiSchemas) {
    schemas = Object.entries(openApiSchemas).map(
      ([schemaName, description]) => {
        const formattedSchema = formatSchema(schemaName, description)
        return formattedSchema
      }
    )
  }
  return { items: schemas }
}

export const formatSwaggerPaths = (
  swaggerPaths: OpenAPIV3.Document['paths']
): ITagApis[] => {
  const tagApisMap: Record<string, IApiInfo[]> = {}
  Object.entries(swaggerPaths).forEach(([path, pathObject]) => {
    pathObject &&
      Object.entries(pathObject).forEach(([method, operationInfo]) => {
        if (
          operationInfo &&
          typeof operationInfo !== 'string' &&
          'tags' in operationInfo
        ) {
          const {
            tags = [],
            parameters,
            requestBody,
            responses,
            ...others
          } = operationInfo || {}
          const params = parameters?.filter(
            (param) => 'in' in param && param.in === 'path'
          )
          const hasParams = !!params && params.length > 0
          let hasBody = false
          if (requestBody && 'content' in requestBody) {
            const mediaSchema = requestBody.content['application/json'].schema
            if (mediaSchema && '$ref' in mediaSchema) {
              hasBody = true
            }
          }
          let hasResponse = false
          Object.values(responses).forEach((item) => {
            if ('content' in item) {
              const media = item.content
              if (media && 'application/json' in media) {
                const mediaSchema = media.schema
                if (mediaSchema && '$ref' in mediaSchema) {
                  hasResponse = true
                }
              }
            }
          })
          const tag = tags.length > 0 ? tags[0] : 'default'
          const api: IApiInfo = {
            path,
            method,
            hasParams,
            hasBody,
            hasArgs: hasParams || hasBody,
            hasResponse,
            parameters,
            requestBody,
            responses,
            ...others,
          }
          if (!tagApisMap[tag]) tagApisMap[tag] = []
          tagApisMap[tag].push(api)
        }
      })
  })
  const apiInfoList: ITagApis[] = Object.entries(tagApisMap).map(
    ([tag, apis]) => ({ tag, apis })
  )
  return apiInfoList
}

// '/api/v1/tickets/{ticketId}/tasks/{taskId}' => `/api/v1/tickets/${ticketId}/tasks/${taskId}`
export const swaggerPathToJs = (path: string, hasParameters: boolean) => {
  // greedy match
  const jsParamsPath = path.replace(/{.+?}/g, (value) => `$${value}`)
  const formattedPath = hasParameters ? `\`${jsParamsPath}\`` : `'${path}'`
  return new Handlebars.SafeString(formattedPath)
}
