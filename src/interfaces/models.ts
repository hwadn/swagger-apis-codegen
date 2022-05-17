import { OpenAPIV3 } from 'openapi-types'

type OpenAPIV3Schemas = OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
interface ISchemaMeta {
  name: string
}
type ISchema = ISchemaMeta & OpenAPIV3Schemas
export interface ISchemas {
  items: ISchema[]
}
