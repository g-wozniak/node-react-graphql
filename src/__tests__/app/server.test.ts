import fetch from 'node-fetch'
import { log } from '../../logger'
import LogLevels from '../../props/LogLevels'
import Logs from '../../props/Logs'
import { system } from '../../server'

/*
  Application server startup tests.
  Verify if the server behaves as expected.
*/

const port = 3131
const hostname = `http://localhost:${port}`

describe('Startup', () => {

  describe('Application server', () => {

    let app

    afterEach(async () => {
      if (app && app.close) {
        app.close()
      }
    })

    it('starts the application server', async () => {
      app = await system({ port: 3131, verbose: false })
      const response = await fetch(hostname)
      expect(response.status).toEqual(200)
    })

    it('starts the application server under a different port', async () => {
      app = await system({ port: 3333, verbose: false })
      const response = await fetch('http://localhost:3333')
      expect(response.status).toEqual(200)
    })

    it('starts the application server in a verbose mode, logging the startup info', async () => {
      const spyConsole = jest.spyOn(console, 'info').mockImplementation()
      app = await system({ port: 3131, verbose: true })
      expect(spyConsole).toHaveBeenCalledTimes(1)
      spyConsole.mockRestore()
    })

    it('logs the startup info, request and response in a verbose mode', async () => {
      const spyConsole = jest.spyOn(console, 'info').mockImplementation()
      app = await system({ port: 3131, verbose: true })
      await fetch(hostname)
      expect(spyConsole).toHaveBeenCalledTimes(3)
      spyConsole.mockRestore()
    })

  })

  describe('Logger', () => {
    it('produces the log', () => {
      const spyConsole = jest.spyOn(console, 'info').mockImplementation()
      log({
        level: LogLevels.info,
        id: Logs.Request,
        message: 'Some random message',
        correlation: '123'
      })
      expect(spyConsole).toBeCalled()
      spyConsole.mockRestore()
    })

    it('produces the log even if message is not passed', () => {
      const spyConsole = jest.spyOn(console, 'info').mockImplementation()
      log({
        level: LogLevels.warning,
        id: Logs.Response,
        correlation: '123'
      })
      expect(spyConsole).toBeCalled()
      spyConsole.mockRestore()
    })
  })

})
