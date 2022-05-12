import { OpenAPIV3 } from 'openapi-types'
import { apisRender } from '@/utils/registerHandlebarTemplates'
import { mkdir, rmdir, open, readdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'

interface IApiInfo extends OpenAPIV3.PathItemObject {
  tag: string
  path: string
  method: string
}

const formatSwaggerPaths = (swaggerPaths: OpenAPIV3.Document['paths']): IApiInfo[] => {
  const apiInfoList: IApiInfo[] = []
  Object.entries(swaggerPaths).forEach(([path, pathObject]) => {
    pathObject && Object.entries(pathObject).forEach(([method, operationInfo]) => {
      if (operationInfo && typeof operationInfo !== 'string' && 'tags' in operationInfo) {
        const { tags = [], ...others } = operationInfo || {}
        const tag = tags.length > 0 ? tags[0] : 'default'
        apiInfoList.push({ path, method, tag, ...others })
      }
    })
  })
  return apiInfoList
}

const createApisDirectory = (directoryPath: string) => {
  const fatherDirPath = dirname(directoryPath)
  const fatherDirExist = existsSync(fatherDirPath)
  if (fatherDirExist) {
    mkdir(directoryPath)
  } else {
    createApisDirectory(fatherDirPath)
    createApisDirectory(directoryPath)
  }
}

const createEmptyFiles = async (directoryPath: string, fileNames: string[]) => {
  const files = await readdir(directoryPath)
  const existedFiles = files.filter((file) => fileNames.includes(file))
  await Promise.all(existedFiles.map(file => unlink(file)))
  return Promise.all(fileNames.map(fileName => open(resolve(directoryPath, fileName), 'w')))
}

export const writeApis = async (swaggerPaths: OpenAPIV3.Document['paths'], outputDir?: string) => {
  const apiInfoList = formatSwaggerPaths(swaggerPaths)
  // create empty files in apis directory
  const fileNames = apiInfoList.map(({ tag }) => `${tag}.ts`)
  const apisDirectory = resolve(__dirname, outputDir || './', 'apis')
  createApisDirectory(apisDirectory)
  await createEmptyFiles(apisDirectory, fileNames)
  // TODO append
  // fileNames.forEach(() => {

  // })

  const res = apisRender({ age: 12, name: 'ccchd' })
  console.log('res:', res)
}
