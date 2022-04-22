import got from 'got'

// TODO 
export const request = async (url: string) => {
  const res = await got.get(url, {
    retry: { limit: 3 },
    timeout: {  }
  })

}
