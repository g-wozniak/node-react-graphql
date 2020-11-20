import LogLevels from '../props/LogLevels';

export interface ILog {
  level: LogLevels
  id: string
  correlation: string
  message?: string
}