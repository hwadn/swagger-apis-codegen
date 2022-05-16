import { OpenAPIV3 } from 'openapi-types'

export interface IApiInfo extends OpenAPIV3.PathItemObject {
  path: string
  method: string
}

export interface ITagApis {
  tag: string
  apis: IApiInfo[]
}


type OpenAPIV3Schemas = OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
interface ISchemaMeta {
  name: string
}
type ISchema = ISchemaMeta & OpenAPIV3Schemas
export interface ISchemas {
  items: ISchema[]
}
