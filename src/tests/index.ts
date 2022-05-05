import 'module-alias/register'
import { Processor } from '@/Processor'

const fileSrc = 'swagger-json.json'
const urlSrc = 'https://bigcompute.infra.test.shopee.io/node-gateway/api/swagger-json'

const processor = new Processor({
  swaggerSchemasSrc: urlSrc,
  type: 'server',
  outDir: './test'
})

processor.start()