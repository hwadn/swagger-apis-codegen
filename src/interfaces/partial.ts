import { OpenAPIV3 } from 'openapi-types'

interface IFormattedSchemaObject extends Omit<OpenAPIV3.SchemaObject, 'properties'> {
  key: string
  properties: IFormattedTypeDescription[]
}

export type IFormattedTypeDescription = IFormattedSchemaObject | OpenAPIV3.ReferenceObject
