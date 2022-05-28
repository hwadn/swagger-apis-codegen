import { OpenAPIV3 } from 'openapi-types'
import { modelsRender } from '@/utils/registerHandlebarTemplates'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { formatSwaggerSchemas } from '@/utils/format'
import { createDirectory } from '@/utils/file'

export const writeModels = async (
  swaggerSchemas: OpenAPIV3.ComponentsObject['schemas'],
  outputDir?: string
) => {
  const modelsDirectory = resolve(__dirname, outputDir || './')
  // Absolute file path
  await createDirectory(modelsDirectory)
  // create empty files in apis directory
  const schemas = formatSwaggerSchemas(swaggerSchemas)
  // TODO
  const modelsCode = modelsRender(schemas)
  const filePath = resolve(modelsDirectory, 'models.ts')
  await writeFile(filePath, modelsCode)
}
