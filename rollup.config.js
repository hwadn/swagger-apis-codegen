import { resolve, extname } from 'path'
import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import externals from 'rollup-plugin-node-externals'

import { readFileSync } from 'fs'
import Handlebars from 'handlebars'

const resolveFile = function(filePath) {
  return resolve(__dirname, filePath)
}

const handlebarsPlugin = () => ({
  resolveId(file) {
    if (extname(file) === '.hbs') {
      return resolveFile(file)
    }
  },
  load(file) {
    if (extname(file) === '.hbs') {
      const template = readFileSync(file, 'utf8').toString().trim();
      const templateSpec = Handlebars.precompile(template)
      return `export default ${templateSpec}`
    }
  }
})

module.exports = [
  {
    input: resolveFile('./src/index.ts'),
    output: {
      file: resolveFile('./dist/index.js'),
      format: 'cjs',
    },
    plugins: [
      externals(),
      nodeResolve(),
      typescript({
        exclude: "node_modules/**",
        typescript: require("typescript")
      }),
      alias({
        entries: [
          {
            find: '@', replacement: 'src'
          }
        ]
      }),
      handlebarsPlugin(),
    ],
  },
]
