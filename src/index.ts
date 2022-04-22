interface IProcessorConfig {
  // Swagger schemas url or file directory
  swaggerSchemasSrc: string
  // Generator methods for server project or browser(frontend) project
  type: 'server' | 'browser'
  // Specify an output folder for all generated request methods files
  outDir?: string
}

class Processor {
  constructor(private readonly config: IProcessorConfig) {}

  start() {
    console.log('start!')
    // TODO read swagger schemas from url or file
    console.log('done!')
  }
  
}

const processor = new Processor({
  swaggerSchemasSrc: 'https://bigcompute.infra.test.shopee.io/node-gateway/api/swagger-json',
  type: 'server',
  outDir: './test'
})

processor.start()
