import { OpenAPIV3 } from 'openapi-types'

interface IFormattedSchemaObjectExtends {
  key: string
  properties: IFormattedTypeDescription[]
}

type IFormattedSchemaObject =
  | (IFormattedSchemaObjectExtends &
      Omit<OpenAPIV3.ArraySchemaObject, 'properties'>)
  | (IFormattedSchemaObjectExtends &
      Omit<OpenAPIV3.NonArraySchemaObject, 'properties'>)

export type IFormattedTypeDescription =
  | IFormattedSchemaObject
  | OpenAPIV3.ReferenceObject
