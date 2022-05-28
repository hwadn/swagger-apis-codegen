import { OpenAPIV3 } from 'openapi-types'

export interface IApiInfo extends OpenAPIV3.PathItemObject {
  path: string
  method: string
}

export class ITagApis {
  tag: string | number
  apis: IApiInfo[]
}
