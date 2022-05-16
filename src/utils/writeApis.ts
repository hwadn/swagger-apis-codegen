import { OpenAPIV3 } from 'openapi-types'
import { apisRender } from '@/utils/registerHandlebarTemplates'
import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { formatSwaggerPaths } from '@/utils/format'
import { createDirectory } from '@/utils/file'

export const writeApis = async (swaggerPaths: OpenAPIV3.Document['paths'], outputDir?: string) => {
  const tagApis = formatSwaggerPaths(swaggerPaths)
  const apisDirectory = resolve(__dirname, outputDir || './', 'apis')
  // Absolute file path
  await createDirectory(apisDirectory)
  await Promise.all(tagApis.map(async (tagApis) => {
    const apisCode = apisRender(tagApis)
    const filePath = resolve(apisDirectory, `${tagApis.tag}.ts`)
    await writeFile(filePath, apisCode)
  }))
}
