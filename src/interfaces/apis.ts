import { OpenAPIV3 } from 'openapi-types'

export interface IApiInfo extends OpenAPIV3.OperationObject {
  path: string
  method: string
  hasParams: boolean
  hasBody: boolean
  hasArgs: boolean
  hasResponse: boolean
}

export class ITagApis {
  tag: string | number
  apis: IApiInfo[]
}
