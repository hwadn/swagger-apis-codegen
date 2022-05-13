import { OpenAPIV3 } from 'openapi-types'
import { apisRender } from '@/utils/registerHandlebarTemplates'
import { mkdir, open, readdir, unlink, appendFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve, dirname, basename } from 'path'
import { IApiInfo, ITagApis } from '@/interfaces/apis'


const formatSwaggerPaths = (swaggerPaths: OpenAPIV3.Document['paths']): ITagApis[] => {
  const tagApisMap: Record<string, IApiInfo[]> = {}
  Object.entries(swaggerPaths).forEach(([path, pathObject]) => {
    pathObject && Object.entries(pathObject).forEach(([method, operationInfo]) => {
      if (operationInfo && typeof operationInfo !== 'string' && 'tags' in operationInfo) {
        const { tags = [], ...others } = operationInfo || {}
        const tag = tags.length > 0 ? tags[0] : 'default'
        const api = { path, method, ...others }
        if (!tagApisMap[tag]) tagApisMap[tag] = []
        tagApisMap[tag].push(api)
      }
    })
  })
  const apiInfoList: ITagApis[] = Object.entries(tagApisMap).map(([tag, apis]) => ({ tag, apis }))
  return apiInfoList
}

const createApisDirectory = async (directoryPath: string) => {
  if (existsSync(directoryPath)) return true

  const fatherDirPath = dirname(directoryPath)
  if (await createApisDirectory(fatherDirPath)) {
    await mkdir(directoryPath)
    return true
  }
}


export const writeApis = async (swaggerPaths: OpenAPIV3.Document['paths'], outputDir?: string) => {
  const tagApis = formatSwaggerPaths(swaggerPaths)
  // create empty files in apis directory
  const apisDirectory = resolve(__dirname, outputDir || './', 'apis')
  // Absolute file path
  const fileNames = tagApis.map(({ tag }) => resolve(apisDirectory, `${tag}.ts`))
  await createApisDirectory(apisDirectory)
  // await writeFile(apisDirectory, fileNames)
  await Promise.all(tagApis.map(async (tagApis) => {
    const apisCode = apisRender(tagApis)
    const filePath = resolve(apisDirectory, `${tagApis.tag}.ts`)
    await writeFile(filePath, apisCode)
  }))
}
