import { IServerConfig } from './intf/IServer'
import { server } from './server'

/* This code is getting translated into pure JS and moved to /dist directory.
   In our deployment environments our main directory ('.') is in fact /dist. Therefore, depending whether we launch our .ts server or .js server the path to the web application will change.
   To tell and identify which server type we are running we use NODE_ENV variable.
   The web application has two possible build types: `dev` and `prod` so we need to specify which we like to link during execution. This is controlled by WEBAPP_BUILD_ENV variable.
*/

const environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'

const config: IServerConfig = {
  environment,
  distDir: environment === 'prod' ? '..' : '../dist',
  webapp: {
    buildEnvironment: process.env.WEBAPP_BUILD_ENV === 'production' ? 'prod' : 'dev'
  }
}
server({
  port: process.env.PORT || 3000,
  config
})