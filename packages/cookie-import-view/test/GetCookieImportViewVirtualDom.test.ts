import { expect, test } from '@jest/globals'
import { mergeClassNames } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getCookieImportViewVirtualDom } from '../src/parts/GetCookieImportViewVirtualDom/GetCookieImportViewVirtualDom.ts'

// cspell:ignore soundcloud

test('renders the Firefox cookie import form', () => {
  const dom = getCookieImportViewVirtualDom()
  expect(dom[0]).toMatchObject({ childCount: 2, className: mergeClassNames(ClassNames.Viewlet, ClassNames.CookieImportView) })
  expect(dom).toContainEqual(expect.objectContaining({ text: 'Import Firefox Cookies' }))
  expect(dom).toContainEqual(expect.objectContaining({ id: 'CookieImportBrowser', name: 'CookieImportBrowser' }))
  expect(dom).toContainEqual(expect.objectContaining({ id: 'CookieImportProfile', name: 'CookieImportProfile' }))
  expect(dom).toContainEqual(expect.objectContaining({ id: 'CookieImportWebsite', placeholder: 'soundcloud.com' }))
  expect(dom).toContainEqual(expect.objectContaining({ name: 'choose-profile' }))
  expect(dom).toContainEqual(expect.objectContaining({ name: 'import-cookies' }))
})
