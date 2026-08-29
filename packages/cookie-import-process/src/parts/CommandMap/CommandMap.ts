import * as FirefoxCookieImport from '../FirefoxCookieImport/FirefoxCookieImport.ts'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'

export const commandMap = {
  'FirefoxCookieImport.getCookies': FirefoxCookieImport.getCookies,
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
}
