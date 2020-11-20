import { ClientFunction } from 'testcafe'
import { system } from '../../server'

import { screen } from '@testing-library/testcafe'

let app

const port = 4000
const hostname = `http://localhost:${port}`

fixture `Landing page`
  .page `${hostname}`
    .before(async ctx => {
      app = await system({ port, verbose: false })
    })
    .after(async (ctx) => {
      if (app) {
        app.close()
      }
    })

test('image exists', async (t) => {
  await t.expect(screen.getByAltText('Test').exists).ok()
})