type ServerCallback = () => void

export interface IServer extends ISystem {
  config: IServerConfig
}

export interface ISystem {
  port: string | number
  config?: IServerConfig
  verbose?: boolean
  callback?: ServerCallback
}

export interface IServerConfig {
  environment: 'prod' | 'dev'
  distDir: string
  webapp: {
    buildEnvironment: 'prod' | 'dev'
  }
}