import fs from 'node:fs'
import path from 'node:path'
import converter from 'swagger2openapi'
import openapiTS, { astToString } from 'openapi-typescript'
const source = process.argv[2] || (fs.existsSync('../studspace/docs/swagger.json') ? '../studspace/docs/swagger.json' : 'docs/backend-swagger.json')
const input = JSON.parse(fs.readFileSync(source, 'utf8'))
const { openapi } = await converter.convertObj(input, {})
// These constraints are enforced by the backend but absent from its Swagger annotations.
for (const name of ['api.CreateBookingRequest', 'api.RescheduleBookingRequest']) {
  const schema = openapi.components.schemas[name]
  schema.required = name.includes('Create') ? ['space_id', 'title', 'starts_at', 'ends_at', 'purpose', 'people_count'] : ['starts_at', 'ends_at']
  for (const field of ['starts_at', 'ends_at']) schema.properties[field].format = 'date-time'
}
fs.writeFileSync(path.resolve('src/shared/api/schema.d.ts'), astToString(await openapiTS(openapi)))
console.log('API types generated from ' + source)
