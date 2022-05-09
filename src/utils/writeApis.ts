import { OpenAPIV3 } from 'openapi-types'
import { apisRender } from '@/utils/registerHandlebarTemplates'

export const writeApis = async (swaggerPaths: OpenAPIV3.Document['paths']) => {
  // TODO
  const res = apisRender({ age: 12, name: 'ccchd' })
  console.log('res:', res)
}
