import { OpenAPIV3 } from 'openapi-types'
import Handlebars from 'handlebars'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import apisTemplate from '@/templates/apis.hbs'

export const writeApis = async (swaggerPaths: OpenAPIV3.Document['paths']) => {
  // TODO
  console.log('apisTemplate:', apisTemplate)
}
