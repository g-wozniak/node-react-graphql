import { EventEmitter } from 'events'
import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { Server } from 'http'
import { v4 as uuid } from 'uuid'
import { IServer, ISystem } from './intf/IServer'
import { IServerLocals } from './intf/IServerLocals'
import { log } from './logger'
import LogLevels from './props/LogLevels'
import Logs from './props/Logs'

import schema from './api/schema'

const path = require('path')
const fs = require('fs')
const helmet = require('helmet')
const cors = require('cors')
const expressStaticGzip = require('express-static-gzip')

const blacklist = [
  '/favicon'
]

const gzipOptions = {
  enableBrotli: true,
  customCompressions: [{
      encodingName: 'deflate',
      fileExtension: 'zz'
  }],
  orderPreference: ['br']
}

const emServerReady = new EventEmitter()

const waitForCallback = async (): Promise<any> => {
  return new Promise((resolve: any) => {
    emServerReady.once('serverListeningEvent', resolve)
  })
}

const systemCallback = (): void => {
  emServerReady.emit('serverListeningEvent')
}

const getProcessingTimeInMS = (time: any): string => {
  return `${(time[0] * 1000 + time[1] / 1e6).toFixed(2)}ms`
}

const logTraffic = (req: Request, res: any, next: express.NextFunction) => {
  const [oldEnd] = [res.end]
  const chunks: Buffer[] = []
  const source = res.req.connection.remoteAddress
  const _hrtime = process.hrtime()
  const { correlation, verbose } = req.app.locals as IServerLocals
  const isBlacklisted = blacklist.find((item) => req.url.indexOf(item) > -1)
  if (req && req.url && blacklist && isBlacklisted) {
    next()
  } else {

    // Request logging
    if (verbose) {
      log({
        level: LogLevels.info,
        id: Logs.Request,
        message: `${req.url} from ${source}`,
        correlation
      })
    }

    // Response logging
    res.end = function(chunk: any): void {
      if (chunk) {
        chunks.push(Buffer.from(chunk))
      }
      const body = Buffer.concat(chunks).toString('utf8')
      const eventTime = getProcessingTimeInMS(process.hrtime(_hrtime))
      if (verbose) {
        log({
          level: LogLevels.info,
          id: Logs.Response,
          message: `${req.url} responsed in ${eventTime} with ${body}`,
          correlation
        })
      }
      oldEnd.apply(res, arguments)
    }

    next()
  }
}

export const server = ({ port, verbose, config, callback }: IServer): Server => {
  const app = express()
  const correlation = uuid()
  const compression = process.env.WEBAPP_COMPRESSION === 'true' ? true : false

  const isVerbose = verbose === undefined
    ? process.env.VERBOSE === 'false'
      ? false : true
    : verbose

  // dist/webapp/{env}/index.html
  const webAppDirPath = path.resolve(__dirname, config.distDir, 'webapp', config.webapp.buildEnvironment)
  const webAppIndexPath = webAppDirPath + '/index.html'

  if (!fs.existsSync(webAppIndexPath)) {
    throw new Error('Web application index not found in a given path ' + webAppDirPath)
  }

  const publicDir = path.resolve(__dirname, config.distDir, 'public')
  const webAppDir = `${webAppDirPath}/app`
  const stylesDir = `${publicDir}/styles`
  const imagesDir = `${publicDir}/images`

  app.locals = {
    correlation,
    verbose: isVerbose
  } as IServerLocals

  app.use(express.json())

  app.use(express.urlencoded({ extended: false }))

  app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }))

  app.use(cors())

  app.use(logTraffic)

  app.use('/app', !compression ? express.static(webAppDir) : expressStaticGzip(webAppDir, gzipOptions))

  app.use('/images', !compression ? express.static(imagesDir) : expressStaticGzip(imagesDir, gzipOptions))

  app.use('/styles', !compression ? express.static(stylesDir) : expressStaticGzip(stylesDir, gzipOptions))

  app.post('/graphql', graphqlHTTP({
    schema,
    graphiql: false
  }))

  app.get('/graphql', graphqlHTTP({
    schema,
    graphiql: true
  }))

  app.get('*', (req, res, next) => {
    res.sendFile(webAppIndexPath)
  })

  return app.listen(port, () => {
    if (isVerbose) {
      log({
        level: LogLevels.info,
        id: Logs.Startup,
        message: `
  Server is listening on port: ${port}\n\n
          Assets compression: ${compression ? 'enabled' : 'disabled'}\n
          Web application index: ${webAppIndexPath}\n
          Web application directory mapping: ${webAppDir} to /app\n
          Images directory mapping: ${imagesDir} to /images\n
          Styles directory mapping: ${stylesDir} to /styles
        `,
        correlation
      })
    }

    if (callback) {
      callback()
    }
  })
}

export const system = async ({ port, verbose, config, callback }: ISystem): Promise<Server> => {
  const webappBuildEnvironment = process.env.WEBAPP_BUILD_ENV === 'production' ? 'prod' : 'dev'
  if (!config) {
    config = {
      environment: 'dev',
      distDir: '../dist',
      webapp: {
        buildEnvironment: webappBuildEnvironment
      }
    }
  }
  const app = server({ port, verbose, config, callback: systemCallback })
  await waitForCallback()
  return app
}