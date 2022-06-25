import { readSwagger } from '@/utils/readSwagger'
import { writeModels } from '@/utils/writeModels'
import { writeApis } from '@/utils/writeApis'

interface IGenerateConfig {
  // Swagger schemas url or file path
  input: string
  // Generator methods for server project or browser(frontend) project
  type: 'server' | 'browser'
  // Output directory, default is './'
  output?: string
}

export const codeGen = async (config: IGenerateConfig) => {
  console.log('start!')
  const { input, output } = config
  const swaggerObject = await readSwagger(input)
  const { paths, components } = swaggerObject
  // TODO check version
  await writeModels(components?.schemas, output)
  await writeApis(paths, output)

  console.log('done!')
}

codeGen({
  input: './src/swagger.json',
  type: 'browser',
  output: 'test',
})
