import * as chalk from 'chalk'
import { ILog } from './intf/ILog'
import LogLevels from './props/LogLevels'

const colors = {}
colors[LogLevels.error] = (str: string): string => chalk.red(str)
colors[LogLevels.info] = (str: string): string => chalk.gray(str)
colors[LogLevels.success] = (str: string): string => chalk.green(str)
colors[LogLevels.report] = (str: string): string => chalk.grey(str)
colors[LogLevels.warning] = (str: string): string => chalk.yellow(str)

export const log = (input: ILog): void => {
  const date = new Date().toUTCString()
  const llf = colors[input.level](input.level.toUpperCase())
  const message = input.message
    ? chalk.cyan(input.message)
    : ''
  console.info(`${chalk.gray(date)}\n${llf} ${chalk.white(input.correlation)} / ${chalk.yellow(input.id)}\n${message}\n`)
}
