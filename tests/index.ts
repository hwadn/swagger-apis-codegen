import { generate } from '../src/index'

const fileSrc = 'swagger-json.json'
const urlSrc = 'https://bigcompute.infra.test.shopee.io/node-gateway/api/swagger-json'

generate({
  input: urlSrc,
  type: 'server',
  output: './test'
})
