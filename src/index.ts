import { readSwagger } from '@/utils/readSwagger'
import { writeModels } from '@/utils/writeModels'
import { writeApis } from '@/utils/writeApis'
import { deleteDirectory } from '@/utils/file'

interface IGenerateConfig {
  // Swagger schemas url or file path
  input: string
  // Generator methods for server project or browser(frontend) project
  type: 'server' | 'browser'
  // Output directory, default is './'
  output?: string
  mode?: 'cover' | 'insert'
}

export const codeGen = async (config: IGenerateConfig) => {
  console.log('start!')
  const { input, output, mode = 'insert' } = config
  const swaggerObject = await readSwagger(input)
  const { paths, components } = swaggerObject
  if (mode === 'cover') {
    await deleteDirectory(output)
  }
  // TODO check version
  await writeModels(components?.schemas, output)
  await writeApis(paths, output)

  console.log('done!')
}

codeGen({
  input: './src/swagger.json',
  type: 'browser',
  output: 'test',
  mode: 'cover',
})
