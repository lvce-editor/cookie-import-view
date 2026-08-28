import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { mergeClassNames, text, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as CookieImportViewStrings from '../CookieImportViewStrings/CookieImportViewStrings.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

// cspell:ignore soundcloud

const rootNode: VirtualDomNode = {
  childCount: 2,
  className: mergeClassNames(ClassNames.Viewlet, ClassNames.CookieImportView),
  type: VirtualDomElements.Div,
}

const headerNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.CookieImportViewHeader,
  type: VirtualDomElements.Div,
}

const titleNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.CookieImportViewTitle,
  type: VirtualDomElements.H1,
}

const descriptionNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.CookieImportViewDescription,
  type: VirtualDomElements.P,
}

const selectFieldNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.CookieImportViewField,
  type: VirtualDomElements.Div,
}

const formNode: VirtualDomNode = {
  childCount: 4,
  className: ClassNames.CookieImportViewForm,
  type: VirtualDomElements.Form,
}

const getSelectField = (id: string, label: string, value: string): readonly VirtualDomNode[] => [
  selectFieldNode,
  {
    childCount: 1,
    className: ClassNames.CookieImportViewLabel,
    htmlFor: id,
    type: VirtualDomElements.Label,
  },
  text(label),
  {
    childCount: 1,
    className: ClassNames.SelectBox,
    id,
    name: id,
    type: VirtualDomElements.Select,
  },
  {
    childCount: 1,
    type: VirtualDomElements.Option,
    value,
  },
  text(value),
]

const websiteField: readonly VirtualDomNode[] = [
  {
    childCount: 2,
    className: ClassNames.CookieImportViewField,
    type: VirtualDomElements.Div,
  },
  {
    childCount: 1,
    className: ClassNames.CookieImportViewLabel,
    htmlFor: 'CookieImportWebsite',
    type: VirtualDomElements.Label,
  },
  text(CookieImportViewStrings.website()),
  {
    childCount: 0,
    className: ClassNames.InputBox,
    id: 'CookieImportWebsite',
    inputType: 'text',
    name: 'website',
    placeholder: 'soundcloud.com',
    type: VirtualDomElements.Input,
  },
]

const actions: readonly VirtualDomNode[] = [
  {
    childCount: 2,
    className: ClassNames.CookieImportViewActions,
    type: VirtualDomElements.Div,
  },
  {
    buttonType: 'button',
    childCount: 1,
    className: mergeClassNames(ClassNames.Button, ClassNames.ButtonSecondary),
    name: 'choose-profile',
    onClick: DomEventListenerFunctions.HandleClick,
    type: VirtualDomElements.Button,
  },
  text(CookieImportViewStrings.chooseFirefoxProfile()),
  {
    buttonType: 'button',
    childCount: 1,
    className: mergeClassNames(ClassNames.Button, ClassNames.ButtonPrimary),
    name: 'import-cookies',
    onClick: DomEventListenerFunctions.HandleClick,
    type: VirtualDomElements.Button,
  },
  text(CookieImportViewStrings.importCookies()),
]

export const getCookieImportViewVirtualDom = (): readonly VirtualDomNode[] => [
  rootNode,
  headerNode,
  titleNode,
  text(CookieImportViewStrings.importFirefoxCookies()),
  descriptionNode,
  text(CookieImportViewStrings.copyWebsiteSignInCookies()),
  formNode,
  ...getSelectField('CookieImportBrowser', CookieImportViewStrings.browser(), CookieImportViewStrings.firefox()),
  ...getSelectField('CookieImportProfile', CookieImportViewStrings.firefoxProfile(), CookieImportViewStrings.defaultProfile()),
  ...websiteField,
  ...actions,
]
