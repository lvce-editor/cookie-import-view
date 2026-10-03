import type { Test } from '@lvce-editor/test-with-playwright'

// cspell:ignore soundcloud

export const name = 'cookie-import-view.open'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Main.openUri', 'cookie-import-view:///')

  const root = Locator('.CookieImportView')
  const title = root.locator('h1')
  const browserIcon = root.locator('.CookieImportViewBrowserIcon')
  const browser = root.locator('#CookieImportBrowser')
  const profile = root.locator('#CookieImportProfile')
  const website = root.locator('#CookieImportWebsite')
  const buttons = root.locator('button')
  await expect(root).toBeVisible()
  await expect(title).toHaveText('Import Firefox Cookies')
  await expect(browserIcon).toBeVisible()
  await expect(browser).toHaveValue('Firefox')
  await expect(profile).toHaveValue('Default profile')
  await expect(website).toHaveAttribute('placeholder', 'soundcloud.com')
  await expect(buttons).toHaveCount(2)
}
