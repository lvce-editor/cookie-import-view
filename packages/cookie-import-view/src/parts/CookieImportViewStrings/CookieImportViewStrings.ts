import * as I18nString from '../I18NString/I18NString.ts'
import * as UiStrings from '../UiStrings/UiStrings.ts'

export const browser = (): string => {
  return I18nString.i18nString(UiStrings.Browser)
}

export const chooseFirefoxProfile = (): string => {
  return I18nString.i18nString(UiStrings.ChooseFirefoxProfile)
}

export const copyWebsiteSignInCookies = (): string => {
  return I18nString.i18nString(UiStrings.CopyWebsiteSignInCookies)
}

export const defaultProfile = (): string => {
  return I18nString.i18nString(UiStrings.DefaultProfile)
}

export const firefox = (): string => {
  return I18nString.i18nString(UiStrings.Firefox)
}

export const firefoxProfile = (): string => {
  return I18nString.i18nString(UiStrings.FirefoxProfile)
}

export const importCookies = (): string => {
  return I18nString.i18nString(UiStrings.ImportCookies)
}

export const importFirefoxCookies = (): string => {
  return I18nString.i18nString(UiStrings.ImportFirefoxCookies)
}

export const website = (): string => {
  return I18nString.i18nString(UiStrings.Website)
}
