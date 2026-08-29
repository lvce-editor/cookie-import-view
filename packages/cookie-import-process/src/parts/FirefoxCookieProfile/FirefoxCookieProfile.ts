/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { isAbsolute, join } from 'node:path'

interface IniSection {
  readonly [key: string]: string
}

const newLineRegex = /\r?\n/
const sectionRegex = /^\[([^\]]+)\]$/

const parseIni = (content: string): Readonly<Record<string, IniSection>> => {
  const sections: Record<string, Record<string, string>> = {}
  let section: Record<string, string> | undefined
  for (const line of content.split(newLineRegex)) {
    const trimmed = line.trim()
    const sectionMatch = sectionRegex.exec(trimmed)
    if (sectionMatch) {
      section = {}
      sections[sectionMatch[1]] = section
    } else if (section && trimmed && !trimmed.startsWith(';') && !trimmed.startsWith('#')) {
      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex !== -1) {
        section[trimmed.slice(0, separatorIndex)] = trimmed.slice(separatorIndex + 1)
      }
    }
  }
  return sections
}

const getProfilePath = (firefoxDataDirectory: string, profile: IniSection): string => {
  return profile.IsRelative === '0' || isAbsolute(profile.Path) ? profile.Path : join(firefoxDataDirectory, profile.Path)
}

export const getFirefoxDataDirectoryForPlatform = (
  platform: NodeJS.Platform,
  homeDirectory: string,
  applicationDataDirectory: string | undefined,
  exists: typeof existsSync = existsSync,
): string => {
  if (platform === 'win32') {
    return join(applicationDataDirectory || join(homeDirectory, 'AppData', 'Roaming'), 'Mozilla', 'Firefox')
  }
  if (platform === 'darwin') {
    return join(homeDirectory, 'Library', 'Application Support', 'Firefox')
  }
  const candidates = [
    join(homeDirectory, '.mozilla', 'firefox'),
    join(homeDirectory, 'snap', 'firefox', 'common', '.mozilla', 'firefox'),
    join(homeDirectory, '.var', 'app', 'org.mozilla.firefox', '.mozilla', 'firefox'),
  ]
  return candidates.find((candidate) => exists(join(candidate, 'profiles.ini'))) || candidates[0]
}

export const getFirefoxDataDirectory = (): string => getFirefoxDataDirectoryForPlatform(process.platform, homedir(), process.env.APPDATA)

export const getCookieDatabasePath = (firefoxDataDirectory: string): string => {
  const profilesPath = join(firefoxDataDirectory, 'profiles.ini')
  if (!existsSync(profilesPath)) {
    throw new Error(`Firefox profile data was not found at ${firefoxDataDirectory}`)
  }
  let sections: Readonly<Record<string, IniSection>>
  try {
    sections = parseIni(readFileSync(profilesPath, 'utf8'))
  } catch {
    throw new Error('Firefox profile metadata is invalid')
  }
  const profiles = Object.entries(sections).filter(([name, profile]) => name.startsWith('Profile') && profile.Path)
  const installs = Object.entries(sections).filter(([name, install]) => name.startsWith('Install') && install.Default)
  const installDefault = (installs.find(([, install]) => install.Locked === '1') || installs[0])?.[1].Default
  const selected =
    profiles.find(([, profile]) => profile.Path === installDefault) || profiles.find(([, profile]) => profile.Default === '1') || profiles[0]
  if (!selected) {
    throw new Error('Firefox profile metadata does not contain a profile')
  }
  const cookieDatabasePath = join(getProfilePath(firefoxDataDirectory, selected[1]), 'cookies.sqlite')
  if (!existsSync(cookieDatabasePath)) {
    throw new Error(`Firefox cookie database was not found for profile ${selected[1].Path}`)
  }
  return cookieDatabasePath
}
