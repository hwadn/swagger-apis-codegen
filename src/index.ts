import { readSwaggerSchema } from '@/utils/readSwaggerSchema'
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

export const generate = async (config: IGenerateConfig) => {
  console.log('start!')
  const { input, output } = config
  const swaggerSchema = await readSwaggerSchema(input)
  const { paths: pathSchema, components: componentsSchema } = swaggerSchema
  // TODO check version
  // writeModels(components?.schemas)
  await writeApis(pathSchema, output)

  console.log('done!')
}

// TODO remove
const urlSrc = 'https://bigcompute.infra.test.shopee.io/node-gateway/api/swagger-json'
generate({
  input: urlSrc,
  type: 'server',
  output: './test'
})
