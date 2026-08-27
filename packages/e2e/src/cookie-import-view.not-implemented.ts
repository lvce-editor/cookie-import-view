import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'cookie-import-view.not-implemented'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Main.openUri', 'cookie-import-view:///')
  const importButton = Locator('.CookieImportView button[name="import-cookies"]')
  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered button is wired to the worker command
  await importButton.click()
  const alert = Locator('.AriaAlert:not(:empty)')
  await expect(alert).toHaveText('Not implemented')
}
