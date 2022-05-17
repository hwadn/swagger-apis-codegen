import Handlebars from 'handlebars'
import { OpenAPIV3 } from 'openapi-types'
import { IApiInfo, ITagApis } from '@/interfaces/apis'
import { ISchemas } from '@/interfaces/models'

export const formatSwaggerSchemas = (openApiSchemas: OpenAPIV3.ComponentsObject['schemas']): ISchemas => {
  let schemas: ISchemas['items'] = []
  if (openApiSchemas) {
    schemas =  Object.entries(openApiSchemas).map(([name, description]) => ({
      name,
      ...description
    }))
  }
  return { items: schemas }
}

export const formatSwaggerPaths = (swaggerPaths: OpenAPIV3.Document['paths']): ITagApis[] => {
  const tagApisMap: Record<string, IApiInfo[]> = {}
  Object.entries(swaggerPaths).forEach(([path, pathObject]) => {
    pathObject && Object.entries(pathObject).forEach(([method, operationInfo]) => {
      if (operationInfo && typeof operationInfo !== 'string' && 'tags' in operationInfo) {
        const { tags = [], ...others } = operationInfo || {}
        const tag = tags.length > 0 ? tags[0] : 'default'
        const api = { path, method, ...others }
        if (!tagApisMap[tag]) tagApisMap[tag] = []
        tagApisMap[tag].push(api)
      }
    })
  })
  const apiInfoList: ITagApis[] = Object.entries(tagApisMap).map(([tag, apis]) => ({ tag, apis }))
  return apiInfoList
}

// '/api/v1/tickets/{ticketId}/tasks/{taskId}' => `/api/v1/tickets/${ticketId}/tasks/${taskId}`
export const swaggerPathToJs = (path: string, hasParameters: boolean) => {
  // greedy match
  const jsParamsPath = path.replace(/{.+?}/g, value => `$${value}`)
  const formattedPath = hasParameters ? `\`${jsParamsPath}\`` : `'${path}'`
  return new Handlebars.SafeString(formattedPath)
}
