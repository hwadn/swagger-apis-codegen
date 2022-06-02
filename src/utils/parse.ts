export const parseRefs = (res: string) => {
  const refPaths = res.split('/')
  return `I${refPaths[refPaths.length - 1]}`
}
