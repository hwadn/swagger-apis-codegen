import { OpenAPIV3 } from 'openapi-types/dist/index'

export const parseRefs = (res: string) => {
  const refPaths = res.split('/')
  return `I${refPaths[refPaths.length - 1]}`
}

export const extractParameters = (
  parameters: OpenAPIV3.PathItemObject['parameters']
) => {
  return parameters?.filter(
    (parameter) => 'in' in parameter && parameter.in === 'path'
  )
}
