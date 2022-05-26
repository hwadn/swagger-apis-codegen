import got from 'got'

export const request = async <T>(url: string) => {
	const response = await got.get<T>(url, {
		https: {
			rejectUnauthorized: false
		}
	})
	return response.body
}
