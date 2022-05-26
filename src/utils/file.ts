import { mkdir } from 'fs/promises'
import { dirname } from 'path'
import { existsSync } from 'fs'

export const createDirectory = async (directoryPath: string) => {
	if (existsSync(directoryPath)) return true

	const fatherDirPath = dirname(directoryPath)
	if (await createDirectory(fatherDirPath)) {
		await mkdir(directoryPath)
		return true
	}
}


