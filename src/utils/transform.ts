import Handlebars from 'handlebars'

// '/api/v1/tickets/{ticketId}/tasks/{taskId}' => `/api/v1/tickets/${ticketId}/tasks/${taskId}`
export const swaggerPathToJs = (path: string, hasParameters: boolean) => {
  // greedy match
  const jsParamsPath = path.replace(/{.+?}/g, value => `$${value}`)
  const formattedPath = hasParameters ? `\`${jsParamsPath}\`` : `'${path}'`
  return new Handlebars.SafeString(formattedPath)
}
