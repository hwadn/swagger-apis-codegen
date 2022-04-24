import { readSwaggerSchema } from '@/readSwaggerSchema'

interface IProcessorConfig {
  // Swagger schemas url or file path
  swaggerSchemasSrc: string
  // Generator methods for server project or browser(frontend) project
  type: 'server' | 'browser'
  // Specify an output folder for all generated request methods files
  outDir?: string
}


export class Processor {
  constructor(private readonly config: IProcessorConfig) {}

  async start () {
    console.log('start!')
    const data = await readSwaggerSchema(this.config.swaggerSchemasSrc)
    // TODO transform swagger spec to xxx
    console.log('done!')
  }
  
}

