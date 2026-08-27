import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'cookie-import-view.nested-uri'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Main.openUri', 'cookie-import-view:///firefox/default')
  const cookieImportView = Locator('.CookieImportView')
  await expect(cookieImportView).toBeVisible()
}
