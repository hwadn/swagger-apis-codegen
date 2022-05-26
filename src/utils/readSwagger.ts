import { request } from '@/utils/request'
import { OpenAPIV3 } from 'openapi-types'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

/**
 * Read swagger schema from url or file path
 * @src  Swagger schemas url or file path
 * @returns swagger schema object
 */
export const readSwagger = async (src: string): Promise<OpenAPIV3.Document> => {
	let swaggerSchemaString: string
	if (isUrl(src)) {
		swaggerSchemaString = await request<string>(src)
	} else {
		const absolutePath = resolve(process.cwd(), src)
		swaggerSchemaString = await readFile(absolutePath, { encoding: 'utf-8' })
	}

	return JSON.parse(swaggerSchemaString)
}

const isUrl = (value: string): boolean => {
	const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/
	return urlPattern.test(value)
}
